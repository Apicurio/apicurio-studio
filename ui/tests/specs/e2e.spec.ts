import { test, expect } from "@playwright/test";
// import { OPENAPI_DATA } from "./data/openapi-simple";

// const OPENAPI_DATA_STR: string = JSON.stringify(OPENAPI_DATA, null, 4);

const STUDIO_UI_URL: string = process.env["STUDIO_UI_URL"] || "http://localhost:8888";

let designId: string = undefined;

test("End to End - Create design", async ({ page }) => {
    await page.goto(STUDIO_UI_URL);
    await expect(page).toHaveTitle(/Apicurio Studio/);

    expect(page.getByTestId("btn-create-design")).toBeDefined();

    // Click the "Create design" button
    await page.getByTestId("btn-create-design").click();
    await expect(page.getByTestId("text-design-name")).toHaveValue("");

    // Create a new design
    await page.getByTestId("text-design-name").fill("e2e-test-design");
    await page.getByTestId("textarea-design-description").fill("An OpenAPI design created by the end-to-end test.");
    await page.getByTestId("btn-modal-create").click();

    // Make sure we redirected to the editor page.
    const expectedPageUrlPattern: RegExp = /.+\/designs\/([a-zA-Z0-9-]+)\/editor/;
    await expect(page).toHaveURL(expectedPageUrlPattern);

    // Get the UUID of the new design.
    const editorPageUrl: string = page.url();
    const editorUrlMatch: RegExpMatchArray = editorPageUrl.match(expectedPageUrlPattern);
    designId =  editorUrlMatch[1];
});

test("End to End - Delete Design", async ({ page }) => {
    await page.goto(STUDIO_UI_URL);
    await expect(page).toHaveTitle(/Apicurio Studio/);

    const kebabMenuButtonTestId: string = `api-actions-${designId}`;
    const deleteButtonTestId: string = `delete-design-${designId}`;

    // Click the action kebab menu button for the design we created above.
    await page.getByTestId(kebabMenuButtonTestId).click();

    // Click the delete button from the action dropdown menu.
    await page.getByTestId(deleteButtonTestId).click();
    expect(page.getByTestId("btn-download-design")).toBeDefined();

    // Check the "I understand..." checkbox
    await page.getByTestId("checkbox-confirm-delete").click();

    // Click the "Delete" button
    await page.getByTestId("btn-modal-delete").click();

});
