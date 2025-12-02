import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

interface Settings {
  id: string;
  whatsapp_group_url: string | null;
  whatsapp_popup_enabled: boolean;
  whatsapp_popup_delay_seconds: number;
  global_download_limit: number;
  watermark_enabled: boolean;
  terms_url: string | null;
  privacy_url: string | null;
  refund_policy_url: string | null;
}

export function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (!error && data) setSettings(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);

    const { error } = await supabase
      .from('settings')
      .update({
        whatsapp_group_url: settings.whatsapp_group_url,
        whatsapp_popup_enabled: settings.whatsapp_popup_enabled,
        whatsapp_popup_delay_seconds: settings.whatsapp_popup_delay_seconds,
        global_download_limit: settings.global_download_limit,
        watermark_enabled: settings.watermark_enabled,
        terms_url: settings.terms_url,
        privacy_url: settings.privacy_url,
        refund_policy_url: settings.refund_policy_url,
      })
      .eq('id', settings.id);

    if (error) {
      toast.error('Failed to save settings');
    } else {
      toast.success('Settings saved successfully');
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 bg-slate-200 rounded" />
      <div className="h-64 bg-slate-200 rounded-xl" />
    </div>;
  }

  if (!settings) {
    return <div className="text-center text-slate-500 py-8">Settings not found</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* WhatsApp Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">WhatsApp Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>WhatsApp Group URL</Label>
            <Input
              value={settings.whatsapp_group_url || ''}
              onChange={(e) => setSettings({ ...settings, whatsapp_group_url: e.target.value })}
              placeholder="https://chat.whatsapp.com/..."
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable WhatsApp Popup</Label>
              <p className="text-sm text-slate-500">Show popup to join WhatsApp group</p>
            </div>
            <Switch
              checked={settings.whatsapp_popup_enabled}
              onCheckedChange={(v) => setSettings({ ...settings, whatsapp_popup_enabled: v })}
            />
          </div>
          <div className="space-y-2">
            <Label>Popup Delay (seconds)</Label>
            <Input
              type="number"
              value={settings.whatsapp_popup_delay_seconds}
              onChange={(e) => setSettings({ ...settings, whatsapp_popup_delay_seconds: parseInt(e.target.value) || 5 })}
              className="max-w-[150px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Download & Security Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Downloads & Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Global Download Limit per File</Label>
            <Input
              type="number"
              value={settings.global_download_limit}
              onChange={(e) => setSettings({ ...settings, global_download_limit: parseInt(e.target.value) || 3 })}
              className="max-w-[150px]"
            />
            <p className="text-sm text-slate-500">Default downloads allowed per purchase</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Watermarking</Label>
              <p className="text-sm text-slate-500">Add watermarks to downloaded files (placeholder)</p>
            </div>
            <Switch
              checked={settings.watermark_enabled}
              onCheckedChange={(v) => setSettings({ ...settings, watermark_enabled: v })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Legal Links */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Legal Pages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Terms & Conditions URL</Label>
            <Input
              value={settings.terms_url || ''}
              onChange={(e) => setSettings({ ...settings, terms_url: e.target.value })}
              placeholder="/terms-conditions"
            />
          </div>
          <div className="space-y-2">
            <Label>Privacy Policy URL</Label>
            <Input
              value={settings.privacy_url || ''}
              onChange={(e) => setSettings({ ...settings, privacy_url: e.target.value })}
              placeholder="/privacy-policy"
            />
          </div>
          <div className="space-y-2">
            <Label>Refund Policy URL</Label>
            <Input
              value={settings.refund_policy_url || ''}
              onChange={(e) => setSettings({ ...settings, refund_policy_url: e.target.value })}
              placeholder="/refund-policy"
            />
          </div>
        </CardContent>
      </Card>

      {/* 2FA Placeholder */}
      <Card className="border-0 shadow-sm opacity-60">
        <CardHeader>
          <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">2FA configuration coming soon. This feature is planned for future implementation.</p>
        </CardContent>
      </Card>
    </div>
  );
}
