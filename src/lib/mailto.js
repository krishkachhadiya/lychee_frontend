
const DEFAULT_SUBJECT = "Hello Lychee Bath Accessories";
const DEFAULT_BODY =
  "Hello Lychee Bath Accessories,\n\nI would like to know more about your products.\n\nThank you.";

export function buildMailtoHref(email, { subject, body } = {}) {
  if (!email) return "";

  const params = new URLSearchParams({
    subject: subject || DEFAULT_SUBJECT,
    body: body || DEFAULT_BODY,
  });

  // URLSearchParams encodes spaces as "+" — mailto clients expect "%20".
  const query = params.toString().replace(/\+/g, "%20");

  return `mailto:${email}?${query}`;
}
