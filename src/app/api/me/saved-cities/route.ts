import { requireUser } from "@/server/auth";
import { withApi } from "@/server/http";
import { listSavedCities } from "@/server/services/savedCities";

export const GET = withApi(async () => {
  const user = await requireUser();
  return Response.json(await listSavedCities(user.id));
});
