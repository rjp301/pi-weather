import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ locals, params, redirect }) => {
  const { id } = params;
  if (!id) return new Response(null, { status: 404 });

  try {
    await locals.pb.collection("emails").delete(id);
    return redirect("/emails");
  } catch (err) {
    return new Response(JSON.stringify(err), { status: 500 });
  }
};
