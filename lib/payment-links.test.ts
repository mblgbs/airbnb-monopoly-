import { describe, expect, it, vi } from "vitest";
import { createServicesPaymentLink } from "./payment-links";

describe("createServicesPaymentLink", () => {
  it("returns url when services returns success", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ url: "https://buy.stripe.com/test_reservation" }),
    });

    const url = await createServicesPaymentLink(
      {
        app: "airbnb",
        context: "reservation",
        referenceId: "resv_1",
        metadata: { listingId: "listing_1" },
        amountHintCents: 24000,
      },
      fetchMock as unknown as typeof fetch
    );

    expect(url).toBe("https://buy.stripe.com/test_reservation");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const requestInit = fetchMock.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(String(requestInit.body));
    expect(body.amount_hint_cents).toBe(24000);
  });

  it("returns null when upstream fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ detail: "error" }),
    });

    const url = await createServicesPaymentLink(
      {
        app: "airbnb",
        context: "reservation",
        referenceId: "resv_2",
      },
      fetchMock as unknown as typeof fetch
    );

    expect(url).toBeNull();
  });

  it("returns null when url is missing", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });

    const url = await createServicesPaymentLink(
      {
        app: "airbnb",
        context: "reservation",
        referenceId: "resv_3",
      },
      fetchMock as unknown as typeof fetch
    );

    expect(url).toBeNull();
  });
});
