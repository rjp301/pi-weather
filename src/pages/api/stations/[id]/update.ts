import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ locals, redirect, params, request }) => {
  const { id } = params;
  if (!id) return new Response(null, { status: 404 });

  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await locals.pb.collection("weather_stations").update(id, { ...data });
    return redirect("/stations");
  } catch (err) {
    return new Response(JSON.stringify(err), { status: 500 });
  }
};
