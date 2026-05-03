import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { UserRole } from "@/types";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/manage/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;
        if (!email || !password) return null;

        const logAuth = (msg: string, extra?: Record<string, unknown>) => {
          if (process.env.NODE_ENV === "development" || process.env.AUTH_DEBUG === "1") {
            console.error(`[next-auth authorize] ${msg}`, extra ?? "");
          }
        };

        try {
          const supabase = getSupabaseAdmin();
          const { data: user, error } = await supabase
            .from("users")
            .select("id, email, name, role, password_hash")
            .eq("email", email)
            .maybeSingle();

          if (error) {
            console.error("[next-auth authorize] Supabase error:", error.code, error.message);
            return null;
          }
          if (!user) {
            logAuth("No user row for email (create the user in Supabase users table)", { email });
            return null;
          }
          if (!user.password_hash) {
            logAuth("User exists but password_hash is null", { email });
            return null;
          }
          const ok = await bcrypt.compare(password, user.password_hash);
          if (!ok) {
            logAuth("Password does not match stored hash", { email });
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? undefined,
            role: (user.role as UserRole) || "customer",
          };
        } catch (err) {
          console.error(
            "[next-auth authorize] Failed (check SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL):",
            err instanceof Error ? err.message : err
          );
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: UserRole }).role ?? "customer";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as UserRole) ?? "customer";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
};
