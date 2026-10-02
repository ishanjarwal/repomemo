import { emailLayout } from "./base-layout";

export const verifyEmailTemplate = (verificationUrl: string) => {
  return emailLayout({
    title: "Verify your email",
    preview: "Confirm your email address to finish creating your account.",
    content: `
      <p style="margin: 0 0 8px;">
        Welcome to YourApp!
      </p>

      <p style="margin: 0;">
        Please confirm your email address to finish setting up your account.
        This helps us keep your account secure.
      </p>
    `,
    buttonText: "Confirm my email",
    buttonUrl: verificationUrl,
  });
};
