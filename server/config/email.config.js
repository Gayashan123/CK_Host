import { Resend } from "resend";

// Environment configuration
const isProduction = process.env.NODE_ENV === 'production';

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromName = process.env.RESEND_FROM_NAME || "CeylonCall";

// Auto-switch between test/prod email
const resendFromEmail = isProduction 
  ? process.env.RESEND_FROM_EMAIL 
  : 'onboarding@resend.dev';

// Validation
if (!resendApiKey) throw new Error("RESEND_API_KEY is missing");
if (!resendFromEmail) throw new Error("RESEND_FROM_EMAIL is missing");

const resend = new Resend(resendApiKey);

export const sender = {
  email: resendFromEmail,
  name: resendFromName,
};

export { resend };