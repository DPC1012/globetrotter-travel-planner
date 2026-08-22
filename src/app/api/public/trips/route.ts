import { withApi } from "@/server/http";
import { listPublicTrips } from "@/server/services/sharing";

export const GET = withApi(async (req: Request) => {
  const url = new URL(req.url);
  return Response.json(await listPublicTrips(url.searchParams.get("page")));
});
