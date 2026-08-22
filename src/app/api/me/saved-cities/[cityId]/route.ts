import { requireUser } from "@/server/auth";
import { withApi } from "@/server/http";
import { saveCity, unsaveCity } from "@/server/services/savedCities";

type Ctx = { params: Promise<{ cityId: string }> };

export const PUT = withApi(async (_req: Request, ctx: Ctx) => {
  const user = await requireUser();
  const { cityId } = await ctx.params;
  return Response.json(await saveCity(user.id, cityId));
});

export const DELETE = withApi(async (_req: Request, ctx: Ctx) => {
  const user = await requireUser();
  const { cityId } = await ctx.params;
  return Response.json(await unsaveCity(user.id, cityId));
});
