import { resend, sender } from "../config/email.config.js";

// Helper function for consistent error handling
const handleEmailError = (error, emailType, to) => {
  console.error(`❌ Error sending ${emailType} email to ${to}:`, error);
  throw new Error(`Failed to send ${emailType} email`);
};

export const sendVerificationEmail = async (to, verificationCode) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to: [to], // Array format is more reliable
      subject: "Verify Your Email",
      html: `
        <div>
          <h2>Email Verification</h2>
          <p>Your verification code is:</p>
          <p style="font-size: 24px; font-weight: bold;">${verificationCode}</p>
          <p>This code will expire in 15 minutes.</p>
        </div>
      `,
    });

    if (error) {
      throw error;
    }

    console.log(`✅ Verification email sent to ${to}`);
    return data;
  } catch (error) {
    handleEmailError(error, "verification", to);
  }
};

export const sendWelcomeEmail = async (to, name) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to: [to],
      subject: `Welcome to ${sender.name}!`,
      html: `
        <div>
          <h2>Welcome, ${name}!</h2>
          <p>Your account is now verified and ready to use.</p>
          <p>Thank you for joining us!</p>
        </div>
      `,
    });

    if (error) {
      throw error;
    }

    console.log(`✅ Welcome email sent to ${to}`);
    return data;
  } catch (error) {
    handleEmailError(error, "welcome", to);
  }
};

export const sendPasswordResetEmail = async (to, resetURL) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to: [to],
      subject: "Password Reset Request",
      html: `
        <div>
          <h2>Password Reset</h2>
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          <a href="${resetURL}" 
             style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
          <p>If you didn't request this, please ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
        </div>
      `,
    });

    if (error) {
      throw error;
    }

    console.log(`✅ Password reset email sent to ${to}`);
    return data;
  } catch (error) {
    handleEmailError(error, "password reset", to);
  }
};

export const sendResetSuccessEmail = async (to) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to: [to],
      subject: "Password Reset Successful",
      html: `
        <div>
          <h2>Password Updated</h2>
          <p>Your password has been successfully changed.</p>
          <p>If you didn't make this change, please contact us immediately.</p>
        </div>
      `,
    });

    if (error) {
      throw error;
    }

    console.log(`✅ Reset success email sent to ${to}`);
    return data;
  } catch (error) {
    handleEmailError(error, "reset success", to);
  }
};