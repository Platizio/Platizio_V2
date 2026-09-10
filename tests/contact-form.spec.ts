import { test, expect } from "@playwright/test";

/**
 * The contact form is the site's only input surface and its only handler of
 * personal data. There is no backend: the form hands name, email, phone and
 * message to WhatsApp (a Meta property) as a URL query string, or to the
 * user's mail client via mailto:. That makes three things worth pinning —
 * that validation actually blocks a bad submit, that the enquiry is encoded
 * rather than injected, and that the disclosure a reader gets before handing
 * over their details says where the details are going.
 */

test.beforeEach(async ({ page }) => {
  await page.goto("/contact", { waitUntil: "networkidle" });
});

test("required fields block an empty submit", async ({ page }) => {
  await page.getByRole("button", { name: /submit via whatsapp/i }).click();
  // Nothing should open; the browser's own validation stops the submit.
  const valid = await page.locator("#name").evaluate((el: HTMLInputElement) => el.checkValidity());
  expect(valid, "empty required name should be invalid").toBe(false);
});

test("the phone field rejects obvious non-numbers", async ({ page }) => {
  // type="tel" performs no validation of its own — without a pattern, "abcdef"
  // is a valid phone number as far as the browser is concerned.
  await page.locator("#phone").fill("abcdef");
  const valid = await page.locator("#phone").evaluate((el: HTMLInputElement) => el.checkValidity());
  expect(valid, 'type="tel" with no pattern accepts letters as a phone number').toBe(false);
});

test("a valid submit opens WhatsApp with the enquiry encoded", async ({ page, context }) => {
  await page.locator("#name").fill("Test Person");
  await page.locator("#email").fill("test@example.com");
  await page.locator("#phone").fill("9876543210");
  await page.locator("#message").fill("Interested in SIF & PMS — what's the minimum?");

  const [popup] = await Promise.all([
    context.waitForEvent("page"),
    page.getByRole("button", { name: /submit via whatsapp/i }).click(),
  ]);

  // wa.me is a redirector: it lands on api.whatsapp.com/send/. Accept either,
  // and assert on what actually matters — that the enquiry crossed intact and
  // percent-encoded, so an "&" or an em dash in the message cannot split the
  // query string or truncate the enquiry.
  const url = popup.url();
  expect(url).toMatch(/wa\.me\/|api\.whatsapp\.com/);
  expect(url, "phone must be the configured business number").toContain("919205523100");
  expect(url, "a literal & from the message would split the query string").not.toMatch(
    /text=[^&]*\s&\s/,
  );
  const decoded = decodeURIComponent(url.replace(/\+/g, " "));
  expect(decoded).toContain("Test Person");
  expect(decoded).toContain("test@example.com");
  expect(decoded).toContain("Interested in SIF & PMS");
  await popup.close();
});

test("the reader is told their details go to WhatsApp before they submit", async ({ page }) => {
  // India's DPDP Act requires notice naming the data and the purpose. The
  // standing notice says only "you agree to be contacted"; it does not say the
  // enquiry leaves for a third-party messaging platform, nor link the policy.
  const text = (await page.locator("form").textContent()) ?? "";
  expect(text, "consent notice should name the third party receiving the data").toMatch(
    /whatsapp/i,
  );
  expect(text, "consent notice should name the operator behind it").toMatch(/meta/i);
  // The enumeration must match what buildEnquiry() actually transmits — which
  // includes the selected product, not just the four free-text fields. An
  // under-inclusive notice is the same defect as no notice for the field it
  // leaves out, so this asserts each item rather than one fixed phrase.
  for (const field of ["name", "email", "phone number", "product", "message"]) {
    expect(text, `consent notice should disclose that the ${field} is sent`).toMatch(
      new RegExp(field, "i"),
    );
  }
  const policyLink = await page.locator('form a[href*="privacy"]').count();
  expect(policyLink, "consent notice should link the privacy policy").toBeGreaterThan(0);
});

test("the consent notice survives submission", async ({ page, context }) => {
  // The notice and the status message share one element, so submitting
  // overwrites the disclosure with "Opening WhatsApp…".
  await page.locator("#name").fill("Test Person");
  await page.locator("#email").fill("test@example.com");
  await page.locator("#phone").fill("9876543210");

  const [popup] = await Promise.all([
    context.waitForEvent("page"),
    page.getByRole("button", { name: /submit via whatsapp/i }).click(),
  ]);
  await popup.close();

  const body = (await page.locator("form").textContent()) ?? "";
  expect(body, "the consent disclosure disappears once submitted").toMatch(/agree to be contacted/i);
});

test("a long message does not silently exceed URL limits", async ({ page }) => {
  // mailto: and wa.me both cap in practice (~2000 and ~4096 chars). The
  // textarea has no maxLength, so a long enquiry is truncated with no warning.
  const max = await page.locator("#message").getAttribute("maxlength");
  expect(max, "message textarea should cap length to fit the mailto/wa.me URL").not.toBeNull();
});

test("all five products are offered in the enquiry select", async ({ page }) => {
  const options = await page.locator("#product option").allTextContents();
  for (const p of ["International", "SIF", "Mutual Funds", "PMS", "AIF"]) {
    expect(options.join(" | ")).toContain(p);
  }
});
