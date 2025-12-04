import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches a secure document via the 'serve-document' Edge Function.
 * 
 * @param contentId - The UUID of the content item to fetch.
 * @returns A Promise that resolves to a Blob URL (string) that can be used in an iframe or PDF viewer.
 * @throws Error if the fetch fails or the user is not authorized.
 */
export const fetchSecureDocument = async (contentId: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('serve-document', {
      body: { content_id: contentId },
      // The responseType: 'blob' is crucial here to tell the client to expect binary data
      // However, supabase-js invoke might return a Blob automatically if the response is binary?
      // Let's explicitly handle the response.
    });

    if (error) {
      console.error("Edge Function Error Details:", error);
      let errorMessage = error.message || "Failed to fetch secure document";
      
      // Try to parse the error body if possible
      try {
         if ((error as any).context) {
             const errorBody = await (error as any).context.json();
             console.error("Edge Function Error Body:", errorBody);
             if (errorBody && errorBody.error) {
                 errorMessage = errorBody.error;
             }
         }
      } catch (e) { 
          console.error("Failed to parse error body:", e);
      }
      
      throw new Error(errorMessage);
    }

    // If the Edge Function returns a Blob directly (which we programmed it to do),
    // 'data' should be that Blob.
    if (!(data instanceof Blob)) {
        // Sometimes supabase-js might try to parse JSON if the content-type isn't perfect,
        // or if we need to explicitly request blob.
        // Let's try to force it if needed, but usually 'invoke' returns the parsed body.
        // If the response is a stream/blob, 'data' might be the Blob.
        
        // If it's not a blob, it might be an error object that wasn't caught by 'error'
        if (data && (data as any).error) {
            throw new Error((data as any).error);
        }
        
        // Fallback: If it's an ArrayBuffer, convert to Blob
        if (data instanceof ArrayBuffer) {
            const blob = new Blob([data], { type: 'application/pdf' });
            return URL.createObjectURL(blob);
        }
    }

    // Create a local object URL for the Blob
    // This URL is temporary and valid only in the current browser session
    const blobUrl = URL.createObjectURL(data);
    return blobUrl;

  } catch (err) {
    console.error("fetchSecureDocument failed:", err);
    throw err;
  }
};
