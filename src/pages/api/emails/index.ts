import { randomString } from "@/lib/utils";
import type { APIRoute } from "astro";

export const post: APIRoute = async ({ locals, url, redirect, request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  try {
    await locals.pb
      .collection("emails")
      .create({ user: locals.user.id, email });
    return redirect(`/emails?datareload=${randomString()}`);
  } catch (err) {
    return new Response(JSON.stringify(err), { status: 500 });
  }
};
