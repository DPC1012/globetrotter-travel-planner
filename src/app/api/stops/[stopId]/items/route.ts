import { requireUser } from "@/server/auth";
import { withApi } from "@/server/http";
import { addItemSchema } from "@/server/schemas";
import { addItem } from "@/server/services/items";

type Ctx = { params: Promise<{ stopId: string }> };

export const POST = withApi(async (req: Request, ctx: Ctx) => {
  const user = await requireUser();
  const { stopId } = await ctx.params;
  const input = addItemSchema.parse(await req.json());
  return Response.json(await addItem(stopId, user.id, input));
});
