import sgMail from "@sendgrid/mail";
import { getEntry } from "astro:content";

export default async function sendEmail(
  subject: string,
  html: string,
  testFlag: boolean
) {
  // const transporter = nodemailer.createTransport({
  //   host: "smtp.gmail.com",
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     type: "OAuth2",
  //     user: process.env.EMAIL_USER,
  //     clientId: process.env.OAUTH_CLIENT_ID,
  //     clientSecret: process.env.OAUTH_CLIENT_SECRET,
  //     refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  //   },
  // });

  if (import.meta.env.SG_API_KEY === undefined) {
    console.log("Could not send email because no API key");
    throw new Error("no SendGrid API key");
  }

  sgMail.setApiKey(import.meta.env.SG_API_KEY);

  const emails = await getEntry("emails", "emails");
  const testEmails = await getEntry("emails", "testEmails");

  const msg = {
    to: testFlag ? testEmails.data : emails.data,
    from: "saeg.weather@gmail.com",
    subject,
    html,
  };

  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode, "Mail sent with SendGrid");
    })
    .catch((error) => {
      console.error(error);
      throw new Error(error);
    });

  // transporter.sendMail(msg, function (error, info) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Email sent: " + info.response);
  //   }
  // });
}
