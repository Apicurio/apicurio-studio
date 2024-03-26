import { test, expect } from "@playwright/test";

const STUDIO_UI_URL: string = process.env["STUDIO_UI_URL"] || "http://localhost:8888";

test("App - Has Title", async ({ page }) => {
    await page.goto(STUDIO_UI_URL);

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Apicurio Studio/);
});
