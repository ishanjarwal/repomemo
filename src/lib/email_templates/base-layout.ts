export const emailLayout = ({
  title,
  preview,
  content,
  buttonText,
  buttonUrl,
}: {
  title: string;
  preview: string;
  content: string;
  buttonText?: string;
  buttonUrl?: string;
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f6f7f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        Helvetica, Arial, sans-serif;
      color: #18181b;
    "
  >
    <div style="display: none; max-height: 0; overflow: hidden;">
      ${preview}
    </div>

    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="background-color: #f6f7f9; padding: 40px 16px;"
    >
      <tr>
        <td align="center">
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            style="
              max-width: 520px;
              background-color: #ffffff;
              border: 1px solid #e4e4e7;
              border-radius: 12px;
              overflow: hidden;
            "
          >
            <!-- Header -->
            <tr>
              <td style="padding: 28px 32px 20px;">
                <div
                  style="
                    font-size: 20px;
                    font-weight: 700;
                    letter-spacing: -0.02em;
                    color: #18181b;
                  "
                >
                  YourApp
                </div>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 12px 32px 36px;">
                <h1
                  style="
                    margin: 0 0 16px;
                    font-size: 24px;
                    line-height: 32px;
                    font-weight: 650;
                    letter-spacing: -0.02em;
                    color: #18181b;
                  "
                >
                  ${title}
                </h1>

                <div
                  style="
                    font-size: 15px;
                    line-height: 24px;
                    color: #52525b;
                  "
                >
                  ${content}
                </div>

                ${
                  buttonText && buttonUrl
                    ? `
                <table
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="margin-top: 28px;"
                >
                  <tr>
                    <td
                      align="center"
                      style="
                        border-radius: 8px;
                        background-color: #18181b;
                      "
                    >
                      <a
                        href="${buttonUrl}"
                        style="
                          display: inline-block;
                          padding: 11px 18px;
                          font-size: 14px;
                          font-weight: 600;
                          line-height: 20px;
                          color: #ffffff;
                          text-decoration: none;
                          border-radius: 8px;
                        "
                      >
                        ${buttonText}
                      </a>
                    </td>
                  </tr>
                </table>
                `
                    : ""
                }

                <p
                  style="
                    margin: 28px 0 0;
                    font-size: 13px;
                    line-height: 21px;
                    color: #71717a;
                  "
                >
                  If you didn't request this email, you can safely ignore it.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="
                  padding: 20px 32px;
                  border-top: 1px solid #f4f4f5;
                  background-color: #fafafa;
                "
              >
                <p
                  style="
                    margin: 0;
                    font-size: 12px;
                    line-height: 18px;
                    color: #a1a1aa;
                  "
                >
                  © ${new Date().getFullYear()} YourApp. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;
};
