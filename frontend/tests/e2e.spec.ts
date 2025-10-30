import { test, expect } from "@playwright/test";

test("renders inc/dec buttons and handles click flow when enabled", async ({ page }) => {
  await page.goto("/");

  const inc = page.getByRole("button", { name: "Increment +1" });
  const dec = page.getByRole("button", { name: "Decrement -1" });

  await expect(inc).toBeVisible();
  await expect(dec).toBeVisible();

  // If wallet is not connected or address not configured, buttons are disabled.
  // When enabled, clicking should show a transient submitting state.
  if (await inc.isEnabled()) {
    await inc.click();
    await expect(inc).toBeDisabled();
    await expect(inc).toHaveText(/Submitting\.\.\./);
  }

  if (await dec.isEnabled()) {
    await dec.click();
    await expect(dec).toBeDisabled();
    await expect(dec).toHaveText(/Submitting\.\.\./);
  }
});


