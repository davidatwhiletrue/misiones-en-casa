import { chromium, expect } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const baseUrl = 'http://localhost:3000';
  let success = true;

  try {
    console.log("1. Starting E2E Verification");
    await page.goto(`${baseUrl}/login`);
    
    // Log in as Admin
    console.log("2. Logging in as Admin...");
    await page.click('text="Mamá"');
    await page.fill('input[type="password"]', '1234');
    await page.click('button:has-text("Entrar")');
    await page.waitForURL('**/admin');
    console.log("   ✅ Logged in as Admin");

    // Create a new mission
    console.log("3. Creating a new mission...");
    await page.click('text="Crear Misión"');
    await page.waitForURL('**/admin/missions/create');
    await page.fill('input[name="title"]', 'E2E Test Mission');
    await page.fill('textarea[name="description"]', 'This is an end-to-end test mission');
    await page.fill('input[name="reward"]', '10.5');
    await page.fill('input[name="xpReward"]', '150');
    await page.selectOption('select[name="category"]', 'cocina');
    await page.selectOption('select[name="difficulty"]', 'hard');
    await page.selectOption('select[name="rarity"]', 'epic');
    // Ensure "repeatable" is unchecked (default off, but good to ensure)
    // Click "Crear Misión"
    await page.click('button:has-text("Crear Misión")');
    await page.waitForURL('**/admin');
    console.log("   ✅ Mission created");

    // Log out
    console.log("4. Logging out Admin...");
    await page.click('button:has-text("Salir")');
    await page.waitForURL('**/login');
    console.log("   ✅ Logged out Admin");

    // Log in as Child
    console.log("5. Logging in as Child...");
    await page.click('text="Lucas"');
    await page.fill('input[type="password"]', '0001');
    await page.click('button:has-text("Entrar")');
    await page.waitForURL('**/child');
    console.log("   ✅ Logged in as Child");

    // Find the mission in "Misiones Disponibles" and accept it
    console.log("6. Accepting the mission...");
    // Assuming the mission card has the title 'E2E Test Mission' and an 'Aceptar misión' button
    const missionCard = page.locator('div.bg-white:has(h3:has-text("E2E Test Mission"))').first();
    await expect(missionCard).toBeVisible();
    await missionCard.locator('button:has-text("Aceptar misión")').click();
    
    // Now it should be in 'Misiones en curso' and have a 'Completar' button
    console.log("7. Marking the mission as completed...");
    await page.waitForTimeout(1000); // Wait for React to update the UI
    const activeMissionCard = page.locator('div.bg-white:has(h3:has-text("E2E Test Mission"))').first();
    await activeMissionCard.locator('button:has-text("Marcar como completada")').click();
    console.log("   ✅ Mission marked as completed");

    // Log out Child
    console.log("8. Logging out Child...");
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Salir")');
    await page.waitForURL('**/login');
    console.log("   ✅ Logged out Child");

    // Log in as Admin to review
    console.log("9. Logging in as Admin to Review...");
    await page.click('text="Mamá"');
    await page.fill('input[type="password"]', '1234');
    await page.click('button:has-text("Entrar")');
    await page.waitForURL('**/admin');

    console.log("10. Reviewing the mission...");
    await page.click('text="Revisar"');
    await page.waitForURL('**/admin/review');
    
    // Find the mission in "Pendientes de revisión" and approve it
    const reviewCard = page.locator('div.bg-white:has(h3:has-text("E2E Test Mission"))').first();
    await expect(reviewCard).toBeVisible();
    await reviewCard.locator('button:has-text("Aprobar")').click();
    console.log("    ✅ Mission approved");

    // Now it should be in "Pendientes de pago"
    console.log("11. Marking the mission as paid...");
    await page.waitForTimeout(1000);
    const paidCard = page.locator('div.bg-white:has(h3:has-text("E2E Test Mission"))').first();
    await expect(paidCard).toBeVisible();
    await paidCard.locator('button:has-text("Marcar como Pagada")').click();
    await page.waitForTimeout(2000); // Wait for action to finish
    console.log("    ✅ Mission marked as paid");

    console.log("🎉 All E2E interactions succeeded.");

  } catch (error) {
    console.error("❌ E2E test failed:", error);
    success = false;
  } finally {
    await browser.close();
    process.exit(success ? 0 : 1);
  }
})();
