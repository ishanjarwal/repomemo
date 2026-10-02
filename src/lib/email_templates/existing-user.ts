import { emailLayout } from "./base-layout";

export const existingUserSignUpTemplate = (loginUrl: string) => {
  return emailLayout({
    title: "You already have an account",
    preview: "An account with this email address already exists.",
    content: `
      <p style="margin: 0 0 8px;">
        It looks like you already have an account with this email address.
      </p>

      <p style="margin: 0;">
        You can sign in using your existing account instead of creating a new
        one.
      </p>
    `,
    buttonText: "Sign in to my account",
    buttonUrl: loginUrl,
  });
};
