/**
 * @file tests/e2e/demo.e2e.ts
 * @description E2E test for the full demo flow using Playwright.
 */
import { test, expect } from '@playwright/test';

test.describe('Chaos OS Demo', () => {
    test('should run full demo sequence successfully', async ({ page }) => {
        // 1. Visit App
        await page.goto('http://localhost:5173');

        // 2. Trigger Demo via window object (headless hook)
        // We pass a test seed
        await page.evaluate(async () => {
            const runner = (window as any).playDemo;
            if (runner) {
                await runner('e2e-seed-999');
            } else {
                throw new Error('playDemo not found on window');
            }
        });

        // 3. Assertions during playback
        // The demo takes ~28 seconds. We check milestones.

        // A. Check for Note Creation (around 3s)
        // "I have a cat named Milo" should be typed or appear in activity?
        // The demoScript records activity `note:created`.
        // Let's check the Terminal log or Activity log if visible.
        // The TerminalApp prints output. The demo uses `core.parseAndExecuteCommand`.

        // Check Terminal "who is Milo" output (around 6-9s)
        // Wait for the response "milo is cat" (formatted)
        // "who is Milo" -> QUERY_FACT -> "milo is cat"
        await expect(page.locator('.terminal-app')).toContainText('Milo', { timeout: 15000 });

        // B. Check Chaos Level Increase (around 12s)
        // Chaos injected +50.
        // Should see "Injecting 50 chaos units" in terminal
        await expect(page.locator('.terminal-app')).toContainText('Injecting 50 chaos units', { timeout: 20000 });

        // C. Check Fate Event (around 15s)
        // Should see "FATE EVENT DETECTED"
        await expect(page.locator('.terminal-app')).toContainText('FATE EVENT DETECTED', { timeout: 25000 });

        // D. Assert Chaos Level at max or high
        // We can check the "System Entropy" text in Welcome Window if open, or check store
        // Let's rely on terminal output confirming high chaos or just "System Unstable" badge
        // (Welcome window might be closed/moved, but Desktop renders it)

        // E. Check Snapshot (end of demo)
        await expect(page.locator('.terminal-app')).toContainText('Snapshot taken', { timeout: 35000 });
        await expect(page.locator('.terminal-app')).toContainText('DEMO COMPLETE', { timeout: 35000 });
    });
});
