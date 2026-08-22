import { requireUser } from "@/server/auth";
import { withApi } from "@/server/http";
import { shareTripSchema } from "@/server/schemas";
import { setPublic } from "@/server/services/sharing";

type Ctx = { params: Promise<{ tripId: string }> };

export const POST = withApi(async (req: Request, ctx: Ctx) => {
  const user = await requireUser();
  const { tripId } = await ctx.params;
  const { isPublic } = shareTripSchema.parse(await req.json());
  return Response.json(await setPublic(tripId, user.id, isPublic));
});
