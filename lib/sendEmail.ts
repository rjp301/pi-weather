import sgMail from "@sendgrid/mail";

export default async function sendEmail(
  emails: string[],
  subject: string,
  html: string,
  from: string
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

  if (html.length === 0) {
    console.error("Must include content");
    throw new Error("no Content");
  }

  if (process.env.SG_API_KEY === undefined) {
    console.log("Could not send email because no API key");
    throw new Error("no SendGrid API key");
  }

  sgMail.setApiKey(process.env.SG_API_KEY);

  const msg = {
    to: emails,
    from,
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
