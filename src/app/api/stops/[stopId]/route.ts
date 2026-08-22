import { requireUser } from "@/server/auth";
import { withApi } from "@/server/http";
import { updateStopSchema } from "@/server/schemas";
import { deleteStop, updateStop } from "@/server/services/stops";

type Ctx = { params: Promise<{ stopId: string }> };

export const PATCH = withApi(async (req: Request, ctx: Ctx) => {
  const user = await requireUser();
  const { stopId } = await ctx.params;
  const input = updateStopSchema.parse(await req.json());
  return Response.json(await updateStop(stopId, user.id, input));
});

export const DELETE = withApi(async (_req: Request, ctx: Ctx) => {
  const user = await requireUser();
  const { stopId } = await ctx.params;
  await deleteStop(stopId, user.id);
  return Response.json({ ok: true });
});
