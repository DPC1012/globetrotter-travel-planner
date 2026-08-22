import { requireUser } from "@/server/auth";
import { withApi } from "@/server/http";
import { updateTripSchema } from "@/server/schemas";
import {
  deleteTrip,
  getTripPayload,
  updateTrip,
} from "@/server/services/trips";

type Ctx = { params: Promise<{ tripId: string }> };

export const GET = withApi(async (_req: Request, ctx: Ctx) => {
  const user = await requireUser();
  const { tripId } = await ctx.params;
  return Response.json(await getTripPayload(tripId, user.id));
});

export const PATCH = withApi(async (req: Request, ctx: Ctx) => {
  const user = await requireUser();
  const { tripId } = await ctx.params;
  const input = updateTripSchema.parse(await req.json());
  return Response.json(await updateTrip(tripId, user.id, input));
});

export const DELETE = withApi(async (_req: Request, ctx: Ctx) => {
  const user = await requireUser();
  const { tripId } = await ctx.params;
  await deleteTrip(tripId, user.id);
  return Response.json({ ok: true });
});
