import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { HttpError } from "@/server/http";

export async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new HttpError(401, "Not signed in");
  return session.user;
}
