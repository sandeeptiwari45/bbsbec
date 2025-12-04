const nodemailer = require('nodemailer');

async function createTestAccount() {
    try {
        const testAccount = await nodemailer.createTestAccount();
        console.log('Ethereal Email Credentials:');
        console.log(`SMTP_HOST=smtp.ethereal.email`);
        console.log(`SMTP_PORT=587`);
        console.log(`SMTP_EMAIL=${testAccount.user}`);
        console.log(`SMTP_PASSWORD=${testAccount.pass}`);
    } catch (err) {
        console.error('Failed to create test account:', err);
    }
}

createTestAccount();
