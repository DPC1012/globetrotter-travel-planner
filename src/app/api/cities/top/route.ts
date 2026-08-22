import { z } from "zod";
import { requireUser } from "@/server/auth";
import { withApi } from "@/server/http";
import { topCities } from "@/server/services/cities";

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(8),
});

export const GET = withApi(async (req: Request) => {
  await requireUser();
  const url = new URL(req.url);
  const { limit } = querySchema.parse(Object.fromEntries(url.searchParams));
  return Response.json(await topCities(limit));
});
