import { resend, sender } from "../config/email.config.js";

export const sendVerificationEmail = async (to, verificationCode) => {
  try {
    await resend.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to,
      subject: "Verify Your Email",
      html: `<p>Your verification code is <strong>${verificationCode}</strong></p>`,
    });
    console.log(`✅ Verification email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    throw error;
  }
};

export const sendWelcomeEmail = async (to, name) => {
  try {
    await resend.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to,
      subject: "Welcome to CeylonCall!",
      html: `<p>Hi ${name},</p><p>Welcome! Your account is now verified.</p>`,
    });
    console.log(`✅ Welcome email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (to, resetURL) => {
  try {
    await resend.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to,
      subject: "Reset Your Password",
      html: `<p>Click the link below to reset your password:</p><p><a href="${resetURL}">${resetURL}</a></p>`,
    });
    console.log(`✅ Password reset email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending reset email:", error);
    throw error;
  }
};

export const sendResetSuccessEmail = async (to) => {
  try {
    await resend.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to,
      subject: "Password Reset Successful",
      html: `<p>Your password has been successfully updated.</p>`,
    });
    console.log(`✅ Reset success email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending reset success email:", error);
    throw error;
  }
};
