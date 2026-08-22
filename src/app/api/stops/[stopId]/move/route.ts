import { requireUser } from "@/server/auth";
import { withApi } from "@/server/http";
import { moveSchema } from "@/server/schemas";
import { moveStop } from "@/server/services/stops";

type Ctx = { params: Promise<{ stopId: string }> };

export const POST = withApi(async (req: Request, ctx: Ctx) => {
  const user = await requireUser();
  const { stopId } = await ctx.params;
  const { direction } = moveSchema.parse(await req.json());
  return Response.json(await moveStop(stopId, user.id, direction));
});
