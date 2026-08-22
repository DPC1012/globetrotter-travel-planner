import { withApi } from "@/server/http";
import { getSharedTripPayload } from "@/server/services/sharing";

type Ctx = { params: Promise<{ slug: string }> };

export const GET = withApi(async (_req: Request, ctx: Ctx) => {
  const { slug } = await ctx.params;
  return Response.json(await getSharedTripPayload(slug));
});
