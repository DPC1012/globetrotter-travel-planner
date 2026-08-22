import { requireUser } from "@/server/auth";
import { withApi } from "@/server/http";
import { moveSchema } from "@/server/schemas";
import { moveItem } from "@/server/services/items";

type Ctx = { params: Promise<{ itemId: string }> };

export const POST = withApi(async (req: Request, ctx: Ctx) => {
  const user = await requireUser();
  const { itemId } = await ctx.params;
  const { direction } = moveSchema.parse(await req.json());
  return Response.json(await moveItem(itemId, user.id, direction));
});
