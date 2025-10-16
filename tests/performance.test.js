const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const fs = require("fs");

async function runLighthouse() {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });

  const options = {
    logLevel: "info",
    output: "html",
    port: chrome.port,
  };

  const runnerResult = await lighthouse("http://localhost:5173", options);

  // `.report` is the HTML report as a string
  const reportHtml = runnerResult.report;
  fs.writeFileSync("lighthouse-report.html", reportHtml);

  // `.lhr` is the Lighthouse Result as a JS object
  console.log("Report is done for", runnerResult.lhr.finalUrl);
  console.log(
    "Performance score was",
    runnerResult.lhr.categories.performance.score * 100
  );
  console.log(
    "Accessibility score was",
    runnerResult.lhr.categories.accessibility.score * 100
  );
  console.log(
    "Best Practices score was",
    runnerResult.lhr.categories["best-practices"].score * 100
  );
  console.log("SEO score was", runnerResult.lhr.categories.seo.score * 100);

  await chrome.kill();
}

// Run performance tests
runLighthouse().catch(console.error);

// Custom Performance Tests
const performanceTests = {
  // Test 1: Measure initial page load
  async testInitialLoad() {
    const start = performance.now();
    // Navigate to app
    await page.goto("http://localhost:5173");
    const loadTime = performance.now() - start;

    console.log(`Initial load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000); // Should load in under 3 seconds
  },

  // Test 2: Measure dashboard render time
  async testDashboardRender() {
    const start = performance.now();
    await page.click('button[contains(text(), "Dashboard")]');
    await page.waitForSelector(".grid");
    const renderTime = performance.now() - start;

    console.log(`Dashboard render time: ${renderTime}ms`);
    expect(renderTime).toBeLessThan(1000);
  },

  // Test 3: Measure memory usage
  async testMemoryUsage() {
    const metrics = await page.metrics();
    console.log("Memory usage:", {
      jsHeapUsedSize: `${(metrics.JSHeapUsedSize / 1024 / 1024).toFixed(2)} MB`,
      jsHeapTotalSize: `${(metrics.JSHeapTotalSize / 1024 / 1024).toFixed(
        2
      )} MB`,
    });

    // Memory should be reasonable
    expect(metrics.JSHeapUsedSize).toBeLessThan(50 * 1024 * 1024); // Less than 50MB
  },
};
