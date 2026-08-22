import { withApi } from "@/server/http";
import { searchActivities } from "@/server/services/cities";

type Ctx = { params: Promise<{ cityId: string }> };

export const GET = withApi(async (req: Request, ctx: Ctx) => {
  const { cityId } = await ctx.params;
  const url = new URL(req.url);
  return Response.json(await searchActivities(cityId, url.searchParams));
});

