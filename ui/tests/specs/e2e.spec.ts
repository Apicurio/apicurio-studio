import { test, expect } from "@playwright/test";
// import { OPENAPI_DATA } from "./data/openapi-simple";

// const OPENAPI_DATA_STR: string = JSON.stringify(OPENAPI_DATA, null, 4);

const STUDIO_UI_URL: string = process.env["STUDIO_UI_URL"] || "http://localhost:8888";

test("End to End - Create draft", async ({ page }) => {
    await page.goto(STUDIO_UI_URL);
    await expect(page).toHaveTitle(/Apicurio Studio/);

    expect(page.getByTestId("btn-toolbar-create-draft")).toBeDefined();

    // Click the "Create draft" button
    await page.getByTestId("btn-toolbar-create-draft").click();
    await expect(page.getByTestId("create-draft-modal-group")).toHaveValue("");

    // Create a new draft
    await page.getByTestId("create-draft-modal-group").fill("e2e-test-group");
    await page.getByTestId("create-draft-modal-id").fill("e2e-test-api");
    await page.getByTestId("create-draft-modal-version").fill("1.0");
    await page.getByText("Next").click();
    await page.getByTestId("openapi_3_blank").click();
    await page.getByText("Next").click();
    await page.getByTestId("create-draft-modal-draft-metadata-name").fill("E2E Test API");
    await page.getByTestId("create-draft-modal-draft-metadata-description").fill("The test API for the end to end Playwright test.");
    await page.locator("#next-wizard-page").click();

    // Make sure we redirected to the draft details page.
    const expectedPageUrlPattern: RegExp = /.+\/drafts\/e2e-test-group\/e2e-test-api\/1.0/;
    await expect(page).toHaveURL(expectedPageUrlPattern);
});

test("End to End - Delete Design", async ({ page }) => {
    await page.goto(`${STUDIO_UI_URL}/drafts/e2e-test-group/e2e-test-api/1.0`);
    await expect(page).toHaveTitle(/Apicurio Studio/);

    // Click the Delete Draft button
    await page.getByTestId("draft-actions-dropdown").click();
    await page.getByTestId("delete-draft").click();

    // Click the Delete button on the resulting confirmation modal
    await page.getByTestId("modal-btn-delete").click();

    // Make sure we redirected to the editor page.
    await expect(page).toHaveURL(`${STUDIO_UI_URL}/drafts`);

});
