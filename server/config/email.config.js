import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;
const resendFromName = process.env.RESEND_FROM_NAME || "CeylonCall";

// Validate required environment variables
if (!resendApiKey || !resendFromEmail) {
  throw new Error("Missing required email configuration in .env file");
}

const resend = new Resend(resendApiKey);

const sender = {
  email: resendFromEmail,
  name: resendFromName,
};

export { resend, sender };