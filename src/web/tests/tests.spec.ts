import { test, expect, chromium } from '@playwright/test';
import { randomBytes } from 'crypto';

test('test login, register and logout', async ({ page }) => {
  const username = randomBytes(16).toString("hex")
  const password = randomBytes(16).toString("hex")
  await page.goto('http://www.test.com/register');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Username' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Register' }).click();
  await page.waitForURL("**/login");
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Username' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Create Game' }).click();
  await page.waitForURL("**/newgame");
  await page.goto("http://www.test.com/logout");
  await page.waitForURL("**/login");
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Username' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
});

test("test create, join and watch game", async ({ page }) => {
  await page.goto('http://www.test.com/')
  await page.getByRole('link', { name: 'Create Game' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('TestUser1');
  await page.getByRole('textbox', { name: 'Password' }).fill('TestPassword');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Create Game' }).click();
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('password');
  await page.getByRole('button', { name: 'Create Game' }).click();
  await page.waitForURL("**/game/*");
  const id = page.url().split("/")[4];
  await page.goto('http://www.test.com/logout');
  await page.getByRole('textbox', { name: 'Username' }).fill('TestUser2');
  await page.getByRole('textbox', { name: 'Password' }).fill('TestPassword');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Join Game' }).click();
  await page.getByRole('spinbutton').fill(id);
  await page.getByRole('textbox').fill("password");
  await page.getByRole('button', { name: 'Join Game' }).click()
  await page.goto('http://www.test.com/logout');
  await page.getByRole('textbox', { name: 'Username' }).fill('TestUser3');
  await page.getByRole('textbox', { name: 'Password' }).fill('TestPassword');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL("http://www.test.com/")
  await page.goto(`http://www.test.com/game/${id}`);
})

test("", async () => {
  const browser = await chromium.launch()
  
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();

  const page1 = await context1.newPage();
  const page2 = await context2.newPage();

  await page1.goto("http://www.test.com/login")
  await page2.goto("http://www.test.com/login")

  await page1.getByRole('textbox', { name: 'Username' }).fill('TestUser1');
  await page1.getByRole('textbox', { name: 'Password' }).fill('TestPassword');
  await page1.getByRole('button', { name: 'Login' }).click();

  await page2.getByRole('textbox', { name: 'Username' }).fill('TestUser2');
  await page2.getByRole('textbox', { name: 'Password' }).fill('TestPassword');
  await page2.getByRole('button', { name: 'Login' }).click();

  await page1.getByRole('link', { name: 'Create Game' }).click();
  await page1.getByRole('textbox').click();
  await page1.getByRole('textbox').fill('password');
  await page1.getByRole('button', { name: 'Create Game' }).click();
  await page1.waitForURL("**/game/*");
  const id = page1.url().split("/")[4];

  await page2.getByRole('link', { name: 'Join Game' }).click();
  await page2.getByRole('spinbutton').fill(id);
  await page2.getByRole('textbox').fill("password");
  await page2.getByRole('button', { name: 'Join Game' }).click()

  await page1.getByRole('button').first().click()
  await page2.getByRole('button').nth(1).click()
  await page1.getByRole('button').nth(3).click()
  await page2.getByRole('button').nth(4).click()
  await page1.locator('button:nth-child(12)').click()

  await expect(page1.getByRole('heading', { name: 'Player 1 won' })).toBeVisible();

  await page1.goto("http://www.test.com/")
  await page2.goto("http://www.test.com/")

  await page1.getByRole('link', { name: 'Create Game' }).click();
  await page1.getByRole('textbox').click();
  await page1.getByRole('textbox').fill('password');
  await page1.getByRole('button', { name: 'Create Game' }).click();
  await page1.waitForURL("**/game/*");
  const id2 = page1.url().split("/")[4];

  await page2.getByRole('link', { name: 'Join Game' }).click();
  await page2.getByRole('spinbutton').fill(id2);
  await page2.getByRole('textbox').fill("password");
  await page2.getByRole('button', { name: 'Join Game' }).click()

  await page1.getByRole('button').first().click()
  await page2.getByRole('button').nth(1).click()
  await page1.getByRole('button').nth(3).click()
  await page2.getByRole('button').nth(4).click()
  await page1.locator('button:nth-child(13)').click()
  await page2.locator('button:nth-child(12)').click()
  await page1.getByRole('button').nth(2).click()
  await page2.getByRole('button').nth(5).click()
  await page1.locator('button:nth-child(14)').click()

  await expect(page1.getByRole('heading', { name: "It's a Draw" })).toBeVisible()
})