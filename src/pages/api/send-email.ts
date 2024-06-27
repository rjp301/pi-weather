// import type { APIRoute } from "astro";
// import { sendWeatherSummary } from "@/api/lib/sendWeatherSummary";

// export const POST: APIRoute = async ({ url, request, redirect, locals }) => {
//   const formData = await request.formData();

//   const test = formData.get("test") === "on";
//   const dateString = String(formData.get("date"));

//   return sendWeatherSummary({
//     pb: locals.pb,
//     user: locals.user,
//     origin: url.origin,
//     dateString,
//     test,
//   });
// };
