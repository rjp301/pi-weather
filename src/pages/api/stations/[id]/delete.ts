import type { APIRoute } from "astro";

export const post: APIRoute = async ({ locals, params, redirect }) => {
  const { id } = params;
  if (!id) return new Response(null, { status: 404 });

  try {
    await locals.pb.collection("weather_stations").delete(id);
    return redirect("/stations");
  } catch (err) {
    return new Response(JSON.stringify(err), { status: 500 });
  }
};
