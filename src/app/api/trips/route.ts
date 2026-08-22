import { requireUser } from "@/server/auth";
import { withApi } from "@/server/http";
import { createTripSchema } from "@/server/schemas";
import { createTrip, listTrips } from "@/server/services/trips";

export const GET = withApi(async () => {
  const user = await requireUser();
  return Response.json(await listTrips(user.id));
});

export const POST = withApi(async (req: Request) => {
  const user = await requireUser();
  const input = createTripSchema.parse(await req.json());
  const trip = await createTrip(user.id, input);
  return Response.json(trip);
});
