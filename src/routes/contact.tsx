import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Send, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageIntro, Section } from "@/components/site/PageIntro";
import { labState } from "@/components/universe/lab-state";
import { contactSchema } from "@/lib/contact";
import { submitContactMessage } from "@/lib/contact-server";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact GENZIQ — Send a signal" },
      { name: "description", content: "Get in touch with GENZIQ about ideas, collaboration or early feedback." },
      { property: "og:title", content: "Contact GENZIQ" },
      { property: "og:description", content: "Ideas, collaboration or early feedback — send a signal to GENZIQ." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

const TOPICS = ["Say hello", "AI services", "Collaboration", "Product idea", "Feedback"];

function Contact() {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sendContactMessage = useServerFn(submitContactMessage);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = contactSchema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      topic,
      message: fd.get("message"),
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] ??= issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      await sendContactMessage({ data: parsed.data });
      labState.pulseAt = performance.now();
      form.reset();
      setTopic(TOPICS[0]);
      toast.success("Message sent", {
        description: "Thanks for reaching out. We'll get back to you soon.",
      });
    } catch {
      toast.error("Message not sent", {
        description: `Please try again later or email ${SITE.email} directly.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const field = "mt-2 rounded-xl border-border bg-glass-strong";

  return (
    <>
      <PageIntro
        eyebrow="Station 06 · Beacon"
        title={
          <>
            <span className="text-chrome">Send us</span> <span className="text-iris">a signal.</span>
          </>
        }
      >
        <p>
          Ideas, collaboration, early feedback, or just a hello — every message is read by a real person at GENZIQ.
        </p>
        <a href={`mailto:${SITE.email}`} className="mt-6 inline-flex items-center gap-2 font-mono text-sm text-aurora hover:underline">
          <Mail className="h-4 w-4" /> {SITE.email}
        </a>
        <p className="mt-2 text-sm text-muted-foreground">
          Your message is sent through Web3Forms.{" "}
          Your email address will be used so we can reply to you.
        </p>
      </PageIntro>

      <Section className="-mt-24 md:-mt-40">
        <form onSubmit={onSubmit} noValidate className="glass-panel max-w-2xl p-7 md:p-10">
          <p className="eyebrow">Transmission</p>
          <div className="mt-6 flex flex-wrap gap-2" role="radiogroup" aria-label="Topic">
            {TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={topic === t}
                onClick={() => setTopic(t)}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs transition-colors",
                  topic === t ? "border-aurora bg-accent text-foreground" : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm">
              Name
              <Input name="name" autoComplete="name" className={field} aria-invalid={!!errors["name"]} />
              {errors["name"] && <span className="mt-1 block text-xs text-destructive">{errors["name"]}</span>}
            </label>
            <label className="block text-sm">
              Email
              <Input name="email" type="email" autoComplete="email" className={field} aria-invalid={!!errors["email"]} />
              {errors["email"] && <span className="mt-1 block text-xs text-destructive">{errors["email"]}</span>}
            </label>
          </div>
          <label className="mt-5 block text-sm">
            Message
            <Textarea name="message" rows={5} className={field} aria-invalid={!!errors["message"]} />
            {errors["message"] && <span className="mt-1 block text-xs text-destructive">{errors["message"]}</span>}
          </label>
          <Button
            type="submit"
            variant="hero"
            size="xl"
            className="mt-7"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Transmit"} <Send />
          </Button>
        </form>
      </Section>
    </>
  );
}
