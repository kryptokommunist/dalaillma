// Playwright test to verify dashboard loads correctly
const { chromium } = require('playwright');
const path = require('path');

async function verifyDashboard() {
    console.log('Starting dashboard verification...\n');

    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Track console errors
    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });
    page.on('pageerror', err => {
        errors.push(err.message);
    });

    const filePath = path.join(__dirname, 'sentiment_dashboard.html');
    console.log(`Loading: file://${filePath}\n`);

    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle' });

    // Check for JavaScript errors
    if (errors.length > 0) {
        console.log('❌ JavaScript errors found:');
        errors.forEach(e => console.log(`  - ${e}`));
    } else {
        console.log('✅ No JavaScript errors');
    }

    // Verify key elements exist
    const checks = [
        { selector: '.dashboard', name: 'Dashboard container' },
        { selector: '#llmInsightsCard', name: 'LLM Insights card' },
        { selector: '#llmInsightsContent', name: 'LLM Insights content' },
        { selector: 'canvas', name: 'Chart canvas elements' },
        { selector: '.stats-grid', name: 'Stats grid' },
        { selector: '#wordcloud', name: 'Word cloud container' }
    ];

    console.log('\nElement checks:');
    for (const check of checks) {
        const element = await page.$(check.selector);
        if (element) {
            console.log(`  ✅ ${check.name}`);
        } else {
            console.log(`  ❌ ${check.name} - NOT FOUND`);
        }
    }

    // Check if LLM insights loaded (will show loading message if file missing)
    const insightsContent = await page.$eval('#llmInsightsContent', el => el.innerHTML);
    if (insightsContent.includes('Loading') || insightsContent.includes('not available')) {
        console.log('\n⚠️  LLM insights: Loading or file not found');
    } else if (insightsContent.includes('Patterns')) {
        console.log('\n✅ LLM insights loaded successfully');
    }

    // Take screenshot
    await page.screenshot({ path: '/tmp/dashboard_screenshot.png', fullPage: true });
    console.log('\n📸 Screenshot saved to /tmp/dashboard_screenshot.png');

    await browser.close();

    console.log('\nVerification complete!');
    return errors.length === 0;
}

verifyDashboard()
    .then(success => process.exit(success ? 0 : 1))
    .catch(err => {
        console.error('Test failed:', err);
        process.exit(1);
    });
