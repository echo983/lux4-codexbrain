import { chromium } from 'playwright-chromium';
import path from 'node:path';
import fs from 'node:fs';

const URL = 'http://127.0.0.1:18571/';
const SCREENSHOT_PATH = path.resolve('/root/lux4-codexbrain/var/rendering_debug.png');

async function debug() {
  console.log(`[DEBUG] Launching headless browser to visit: ${URL}`);
  
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  page.setViewportSize({ width: 1280, height: 720 });
  
  page.on('console', msg => {
    console.log(`[BROWSER ${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.log(`[BROWSER ERROR] ${err.message}`);
  });

  try {
    console.log(`[DEBUG] Navigating to page...`);
    await page.goto(URL, { waitUntil: 'networkidle' });
    
    console.log(`[DEBUG] Waiting for rendering to stabilize...`);
    await page.waitForTimeout(15000); // 增加到 15 秒确保贴图加载

    const sceneInfo = await page.evaluate(() => {
      return {
        status: document.getElementById('status')?.innerText,
        hasCanvas: !!document.querySelector('canvas')
      };
    });
    console.log(`[DEBUG] Scene Info:`, sceneInfo);

    await page.screenshot({ path: SCREENSHOT_PATH });
    console.log(`[DEBUG] Screenshot captured to ${SCREENSHOT_PATH}`);

  } catch (error) {
    console.error(`[DEBUG] Error:`, error);
  } finally {
    await browser.close();
  }
}

debug();
