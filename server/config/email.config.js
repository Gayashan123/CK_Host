import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;
const resendFromName = process.env.RESEND_FROM_NAME || "CeylonCall";

// Basic check and log
if (!resendApiKey) {
  console.error("❌ RESEND_API_KEY is missing from .env");
} else {
  console.log("✅ RESEND_API_KEY loaded");
}

if (!resendFromEmail) {
  console.error("❌ RESEND_FROM_EMAIL is missing from .env");
} else {
  console.log(`✅ Sender email: ${resendFromEmail}`);
}

const resend = new Resend(resendApiKey);

const sender = {
  email: resendFromEmail,
  name: resendFromName,
};

export { resend, sender };
