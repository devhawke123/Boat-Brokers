const { chromium } = require('playwright')
;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } })
  await page.goto('http://localhost:5183/buying', { waitUntil: 'networkidle' })
  const grid = page.locator('h3:has-text("Search")').first()
  await grid.scrollIntoViewIfNeeded()
  await page.screenshot({ path: '../buying-cards-nohover.png' })

  const card3 = page.locator('h3:has-text("Get in touch")').first()
  await card3.hover()
  await page.screenshot({ path: '../buying-cards-hover-card3.png' })

  await browser.close()
})()
