import { describe, expect, it } from "vitest";

import { STATIONS, stationForPath } from "@/components/universe/stations";
import { buildContactSubmission, contactSchema } from "@/lib/contact";
import { SITE } from "@/lib/site";

describe("site stations", () => {
  it("has the five launch pages plus Careers", () => {
    expect(STATIONS.map((s) => s.path)).toEqual([
      "/",
      "/about",
      "/products",
      "/innovation",
      "/careers",
      "/contact",
    ]);
  });

  it("maps each page (with or without trailing slash) to its own station", () => {
    expect(stationForPath("/about").id).toBe("about");
    expect(stationForPath("/contact/").id).toBe("contact");
    expect(stationForPath("/careers").id).toBe("careers");
    expect(stationForPath("/nowhere").id).toBe("home");
  });
});

describe("contact form", () => {
  it("rejects an invalid email", () => {
    const r = contactSchema.safeParse({
      name: "A",
      email: "nope",
      topic: "",
      message: "Hello there GENZIQ",
    });
    expect(r.success).toBe(false);
  });

  it("accepts a one-character message but not an empty one", () => {
    const base = { name: "A", email: "a@b.co", topic: "" };
    expect(contactSchema.safeParse({ ...base, message: "h" }).success).toBe(true);
    expect(contactSchema.safeParse({ ...base, message: "   " }).success).toBe(false);
  });

  it("sets the visitor as the reply-to and includes their details", () => {
    const submission = buildContactSubmission({
      name: "Ria",
      email: "ria@x.io",
      topic: "Feedback",
      message: "Love it",
    });
    expect(submission.replyto).toBe("ria@x.io");
    expect(submission.email).toBe("ria@x.io");
    expect(submission.subject).toContain("Feedback");
    expect(submission.message).toContain("Love it");
  });

  it("removes line breaks from the subject fields", () => {
    const submission = buildContactSubmission({
      name: "Ria\nTeam",
      email: "ria@x.io",
      topic: "Feedback\r\nFollow-up",
      message: "Love it",
    });
    expect(submission.subject).not.toMatch(/[\r\n]/);
  });
});

describe("company facts", () => {
  it("links the founder's LinkedIn and the GenzIQ GitHub organization", () => {
    expect(SITE.founder.linkedin).toBe("https://www.linkedin.com/in/anushree-n-488756238");
    expect(SITE.github).toBe("https://github.com/GENZIQ");
  });

  it("is not hiring right now", () => {
    expect(SITE.openRoles).toEqual([]);
  });
});
