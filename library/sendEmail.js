import fs from "fs/promises";
import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const PATH = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(PATH, "..", ".env") });

sgMail.setApiKey(process.env.SG_API_KEY);

async function sendGmail(subject, html, recipients) {
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

  const msg = {
    to: recipients,
    subject,
    html,
  };

  transporter.sendMail(msg, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      throw new Error(error);
    }
  });
}

async function sendGrid(subject, html, recipients) {
  const msg = {
    to: recipients,
    from: "saeg.weather@gmail.com",
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent with SendGrid");
  } catch (err) {
    throw new Error(err);
  }
}

async function sendEmail(subject, testFlag) {
  const fname_html = path.join(PATH, "..", "html", "summary.html");
  const html = await fs.readFile(fname_html, "utf-8");

  const fname_emails = path.join(PATH, "..", "data", "email_list.csv");
  const emails = (await fs.readFile(fname_emails, "utf-8"))
    .replace(/\r\n/g, "\n")
    .split("\n");

  const reciepients =
    testFlag === "--email-test" ? "rileypaul96@gmail.com" : emails;

  try {
    await sendGrid(subject, html, reciepients);
  } catch (err) {
    console.log("Could not send with SendGrid");
  }
}

await sendEmail(process.argv[2], process.argv[3]);
