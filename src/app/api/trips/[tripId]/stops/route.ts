import { requireUser } from "@/server/auth";
import { withApi } from "@/server/http";
import { addStopSchema } from "@/server/schemas";
import { addStop } from "@/server/services/stops";

type Ctx = { params: Promise<{ tripId: string }> };

export const POST = withApi(async (req: Request, ctx: Ctx) => {
  const user = await requireUser();
  const { tripId } = await ctx.params;
  const input = addStopSchema.parse(await req.json());
  return Response.json(await addStop(tripId, user.id, input));
});
