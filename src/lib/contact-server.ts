import { createServerFn } from "@tanstack/react-start";

import { buildContactSubmission, contactSchema } from "@/lib/contact";

export const submitContactMessage = createServerFn({ method: "POST" })
  .validator(contactSchema)
  .handler(async ({ data }) => {
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      console.error("Web3Forms contact delivery is not configured: missing WEB3FORMS_ACCESS_KEY.");
      throw new Error("Contact form email service is not configured.");
    }

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        ...buildContactSubmission(data),
      }),
    });

    const result = (await response.json()) as { success?: boolean; message?: string };
    if (!response.ok || result.success !== true) {
      console.error("Web3Forms contact delivery failed", {
        status: response.status,
        message: result.message,
      });
      throw new Error("The email service could not accept this message.");
    }

    return { success: true };
  });
