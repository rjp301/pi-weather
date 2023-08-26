import type { APIRoute } from "astro";

export const post: APIRoute = async ({ locals, redirect, request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await locals.pb.collection("users").update(locals.user.id, { ...data });
    return redirect("/settings");
  } catch (err) {
    return new Response(JSON.stringify(err), { status: 500 });
  }
};
