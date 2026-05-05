/** @type {import('next').NextConfig} */
const remotePatterns = [];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (supabaseUrl) {
  try {
    const host = new URL(supabaseUrl).hostname;
    remotePatterns.push({
      protocol: "https",
      hostname: host,
      pathname: "/storage/v1/object/public/**",
    });
  } catch {
    /* ignore invalid URL */
  }
}

const nextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
