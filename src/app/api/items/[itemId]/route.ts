import { requireUser } from "@/server/auth";
import { withApi } from "@/server/http";
import { updateItemSchema } from "@/server/schemas";
import { deleteItem, updateItem } from "@/server/services/items";

type Ctx = { params: Promise<{ itemId: string }> };

export const PATCH = withApi(async (req: Request, ctx: Ctx) => {
  const user = await requireUser();
  const { itemId } = await ctx.params;
  const input = updateItemSchema.parse(await req.json());
  return Response.json(await updateItem(itemId, user.id, input));
});

export const DELETE = withApi(async (_req: Request, ctx: Ctx) => {
  const user = await requireUser();
  const { itemId } = await ctx.params;
  await deleteItem(itemId, user.id);
  return Response.json({ ok: true });
});
