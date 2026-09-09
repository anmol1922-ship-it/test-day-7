import { expect, test, type Page } from "@playwright/test";

const interceptedReply =
  "Keep your GST records organized and check the latest notification.";

async function interceptGemini(
  page: Page,
  onPayload?: (payload: Record<string, unknown>) => void,
) {
  await page.route("**generativelanguage.googleapis.com/**", async (route) => {
    const payload = route.request().postDataJSON() as Record<string, unknown>;
    onPayload?.(payload);

    const response = {
      candidates: [
        {
          content: {
            parts: [{ text: interceptedReply }],
            role: "model",
          },
          finishReason: "STOP",
          index: 0,
        },
      ],
    };

    await route.fulfill({
      status: 200,
      contentType: "text/event-stream",
      body: `data: ${JSON.stringify(response)}\n\n`,
    });
  });
}

test("answers a question through an intercepted Gemini request", async ({
  page,
}) => {
  let requestPayload: Record<string, unknown> | undefined;
  await interceptGemini(page, (payload) => {
    requestPayload = payload;
  });

  await page.goto("/");
  await page.getByLabel("Your question").fill("How should I prepare for GST?");
  await page.getByRole("button", { name: /send/i }).click();

  await expect(page.getByText(interceptedReply)).toBeVisible();
  expect(requestPayload).toMatchObject({
    contents: [
      {
        parts: [{ text: "How should I prepare for GST?" }],
      },
    ],
    systemInstruction: {
      parts: [{ text: expect.stringContaining("CA Buddy") }],
    },
  });
});

test("New chat clears the active conversation after a response", async ({
  page,
}) => {
  await interceptGemini(page);

  await page.goto("/");
  await page.getByLabel("Your question").fill("Do I need to register for GST?");
  await page.getByRole("button", { name: /send/i }).click();
  await expect(page.getByText(interceptedReply)).toBeVisible();

  await page.getByRole("button", { name: /new chat/i }).click();

  await expect(
    page.getByText("Do I need to register for GST?"),
  ).not.toBeVisible();
  await expect(page.getByText(interceptedReply)).not.toBeVisible();
});
