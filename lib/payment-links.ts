type FetchLike = typeof fetch;

export type PaymentLinkRequest = {
  app: "airbnb";
  context: "reservation";
  referenceId: string;
  metadata?: Record<string, unknown>;
  amountHintCents?: number;
};

function servicesBaseUrl(): string {
  const raw = process.env.SERVICES_MONOPOLY_BASE_URL ?? "http://127.0.0.1:8004";
  return raw.replace(/\/+$/, "");
}

export async function createServicesPaymentLink(
  input: PaymentLinkRequest,
  fetchImpl: FetchLike = fetch
): Promise<string | null> {
  const response = await fetchImpl(`${servicesBaseUrl()}/payments/link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app: input.app,
      context: input.context,
      reference_id: input.referenceId,
      metadata: input.metadata ?? {},
      amount_hint_cents: input.amountHintCents,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data: unknown = await response.json();
  if (typeof data === "object" && data !== null && "url" in data) {
    const url = (data as { url: unknown }).url;
    if (typeof url === "string" && url.trim()) {
      return url;
    }
  }
  return null;
}
