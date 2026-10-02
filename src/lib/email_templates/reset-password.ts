import { emailLayout } from "./base-layout";

export const resetPasswordTemplate = (resetUrl: string) => {
  return emailLayout({
    title: "Reset your password",
    preview: "Use the link below to reset your password.",
    content: `
      <p style="margin: 0 0 8px;">
        We received a request to reset the password for your account.
      </p>

      <p style="margin: 0;">
        Click the button below to choose a new password. For your security,
        this link will expire after a limited time.
      </p>
    `,
    buttonText: "Reset password",
    buttonUrl: resetUrl,
  });
};
