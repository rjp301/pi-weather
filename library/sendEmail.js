import fs from "fs/promises";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export async function sendEmail(subject, testFlag) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });

  const current_path = path.dirname(__filename)

  const fname_html = path.join(current_path,"..","html","summary.html")
  const html = await fs.readFile(fname_html, "utf-8");

  const fname_emails = path.join(current_path,"..","data","email_list.csv")
  const emails = (await fs.readFile(fname_emails, "utf-8"))
    .replace(/\r\n/g, "\n")
    .split("\n");

  const msg = {
    to: testFlag === "--email-test" ? "rileypaul96@gmail.com" : emails,
    subject,
    html,
  };

  transporter.sendMail(msg, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

await sendEmail(process.argv[2], process.argv[3]);
