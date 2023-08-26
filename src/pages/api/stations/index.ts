import type { APIRoute } from "astro";

export const post: APIRoute = async ({ locals, redirect, request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await locals.pb
      .collection("weather_stations")
      .create({ user: locals.user.id, ...data });
    return redirect("/stations");
  } catch (err) {
    return new Response(JSON.stringify(err), { status: 500 });
  }
};
