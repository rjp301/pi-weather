import type { APIRoute } from "astro";
import { v4 as uuidv4 } from "uuid";

export const post: APIRoute = async ({ locals, redirect, request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await locals.pb
      .collection("weather_stations")
      .create({ user: locals.user.id, ...data });
    return redirect(`/stations?datareload=${uuidv4()}`);
  } catch (err) {
    return new Response(JSON.stringify(err), { status: 500 });
  }
};
