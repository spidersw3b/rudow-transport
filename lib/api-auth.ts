import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiError } from "@/lib/api-response";
import type { UserRole } from "@/types";

export const ADMIN_ROLES: UserRole[] = ["admin", "super_admin"];

export async function getSessionOrUnauthorized() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: apiError(401, "UNAUTHORIZED", "Authentication required.") };
  }
  return { session };
}

export function requireRole(role: UserRole, currentRole?: UserRole) {
  if (currentRole !== role) {
    return apiError(403, "FORBIDDEN", "You do not have permission for this action.");
  }
  return null;
}

export function requireAnyRole(allowed: UserRole[], currentRole?: UserRole) {
  if (!currentRole || !allowed.includes(currentRole)) {
    return apiError(403, "FORBIDDEN", "You do not have permission for this action.");
  }
  return null;
}
