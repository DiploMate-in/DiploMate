import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceRoleKey =
      Deno.env.get('SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const authHeader = req.headers.get('Authorization');

    console.log(
      `[Serve-Document] Init. URL: ${!!supabaseUrl}, AnonKey: ${!!anonKey}, SRKey: ${!!serviceRoleKey}, AuthHeader: ${!!authHeader}`,
    );

    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    // 1. Initialize User Client
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // 2. Get User
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      console.error('[Serve-Document] Auth Error:', userError);
      return new Response(JSON.stringify({ error: 'Unauthorized', details: userError }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. Parse Request Body
    const { content_id } = await req.json();
    if (!content_id) {
      throw new Error('Missing content_id');
    }

    // 4. Verify Purchase
    const { data: purchase, error: purchaseError } = await userClient
      .from('purchases')
      .select('id, status')
      .eq('content_item_id', content_id)
      .eq('status', 'completed')
      .maybeSingle();

    if (!purchase) {
      console.error(
        `[Serve-Document] Purchase not found for user ${user.id} and content ${content_id}`,
      );
      return new Response(
        JSON.stringify({
          error: 'Forbidden: Content not purchased',
          debug: { userId: user.id, contentId: content_id },
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // 5. Get File Path
    const { data: contentItem } = await userClient
      .from('content_items')
      .select('file_url')
      .eq('id', content_id)
      .single();

    if (!contentItem?.file_url) {
      return new Response(JSON.stringify({ error: 'Content not found or missing file URL' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check for Google Drive
    if (
      contentItem.file_url.includes('drive.google.com') ||
      contentItem.file_url.includes('docs.google.com')
    ) {
      return new Response(
        JSON.stringify({
          error: 'External content cannot be viewed securely',
          isExternal: true,
          url: contentItem.file_url,
        }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // 6. Download File (Admin Client)
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const BUCKET_NAME = 'study_materials';
    let filePath = contentItem.file_url;

    if (filePath.includes(BUCKET_NAME)) {
      const parts = filePath.split(`${BUCKET_NAME}/`);
      if (parts.length > 1) filePath = parts[1];
    }
    if (filePath.startsWith('/')) filePath = filePath.substring(1);
    filePath = decodeURIComponent(filePath);

    const { data: fileData, error: fileError } = await adminClient.storage
      .from(BUCKET_NAME)
      .download(filePath);

    if (fileError) {
      console.error('[Serve-Document] Storage Error:', fileError);
      return new Response(
        JSON.stringify({ error: 'Failed to retrieve file', details: fileError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(fileData, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('[Serve-Document] Unexpected Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
