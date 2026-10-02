import { emailLayout } from "./base-layout";

export const resetPasswordSuccessTemplate = (loginUrl: string) => {
  return emailLayout({
    title: "Password reset successful",
    preview: "Your password has been successfully updated.",
    content: `
      <p style="margin: 0 0 8px;">
        Your password has been successfully changed.
      </p>

      <p style="margin: 0;">
        You can now use your new password to sign in to your account.
      </p>
    `,
    buttonText: "Sign in",
    buttonUrl: loginUrl,
  });
};
