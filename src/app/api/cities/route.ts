import { withApi } from "@/server/http";
import { searchCities } from "@/server/services/cities";

export const GET = withApi(async (req: Request) => {
  const url = new URL(req.url);
  return Response.json(await searchCities(url.searchParams));
});

