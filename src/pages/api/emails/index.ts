import type { APIRoute } from "astro";
import { v4 as uuidv4 } from "uuid";

export const post: APIRoute = async ({ locals, url, redirect, request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  try {
    await locals.pb
      .collection("emails")
      .create({ user: locals.user.id, email });
    return redirect(`/emails?datareload=${uuidv4()}`);
  } catch (err) {
    return new Response(JSON.stringify(err), { status: 500 });
  }
};
