import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please tell us your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  topic: z.string().trim().max(60),
  message: z.string().trim().min(1, "Please write a message").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export function buildContactSubmission(data: ContactInput) {
  const topic = data.topic.replace(/[\r\n]/g, " ").trim() || "Hello";
  const name = data.name.replace(/[\r\n]/g, " ").trim();

  return {
    name,
    email: data.email,
    replyto: data.email,
    subject: `[GENZIQ] ${topic} — from ${name}`,
    message: `Topic: ${topic}\n\n${data.message}`,
    from_name: "GENZIQ Website",
  };
}
