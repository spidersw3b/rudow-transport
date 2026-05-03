export default function AdminSettingsPage() {
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="font-display text-2xl font-bold text-rt-navy">Settings</h1>
      <p className="font-body text-sm text-rt-text-mid">
        Branding, notification recipients, and integration keys are managed via environment variables and
        your Supabase project. Update <code className="rounded bg-rt-navy-light px-1">.env.local</code>{" "}
        for local changes, then mirror values in Vercel for production.
      </p>
      <ul className="list-disc space-y-2 pl-5 font-body text-sm text-rt-text-mid">
        <li>Dispatch inbox: dispatch@rudowtransportation.net</li>
        <li>Resend domain verification required for outbound mail</li>
        <li>Storage bucket: uploads (public read if using public URLs)</li>
      </ul>
    </div>
  );
}
