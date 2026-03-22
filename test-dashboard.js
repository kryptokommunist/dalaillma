const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Collect console errors
    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });
    page.on('pageerror', err => {
        errors.push(err.message);
    });

    // Load the dashboard
    const filePath = path.join(__dirname, 'private_data', 'sentiment_dashboard_personal.html');
    console.log('Loading:', `file://${filePath}`);

    await page.goto(`file://${filePath}`);

    // Wait for page to initialize
    await page.waitForTimeout(2000);

    // Check for the specific categoryData error
    const categoryError = errors.find(e => e.includes('categoryData') && e.includes('initialization'));

    if (categoryError) {
        console.error('FAIL: categoryData initialization error still present');
        console.error(categoryError);
        process.exitCode = 1;
    } else {
        console.log('PASS: No categoryData initialization error');
    }

    // Report any other errors (for info, not failing)
    const otherErrors = errors.filter(e => !e.includes('categoryData'));
    if (otherErrors.length > 0) {
        console.log('\nOther console errors (non-blocking):');
        otherErrors.forEach(e => console.log(' -', e.substring(0, 100)));
    }

    await browser.close();
})();
