const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Reminder = require('../models/Reminder');
const User = require('../models/User');

// Configure Email Transporter
// NOTE: For production, use environment variables for credentials.
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your SMTP service
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

const startScheduler = () => {
    console.log('⏰ Reminder Scheduler Started...');

    // Run every minute
    cron.schedule('* * * * *', async () => {
        const now = new Date();
        const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

        try {
            // Find reminders matching current time
            const reminders = await Reminder.find({ time: currentTime }).populate('user');

            if (reminders.length > 0) {
                console.log(`Found ${reminders.length} reminders for ${currentTime}`);
            }

            for (const reminder of reminders) {
                if (reminder.user && reminder.user.email) {
                    const mailOptions = {
                        from: '"CureSense AI" <noreply@curesense.ai>',
                        to: reminder.user.email,
                        subject: `💊 Medicine Reminder: ${reminder.medicineName}`,
                        html: `
                            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                                <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px;">
                                    <h2 style="color: #2563eb;">Time to take your medicine!</h2>
                                    <p style="font-size: 16px;">Hello <strong>${reminder.user.name}</strong>,</p>
                                    <p>This is a friendly reminder to take your medication:</p>
                                    <div style="background-color: #e0f2fe; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                        <h3 style="margin: 0; color: #0369a1;">${reminder.medicineName}</h3>
                                        <p style="margin: 5px 0 0;">Dosage: <strong>${reminder.dosage}</strong></p>
                                        <p style="margin: 5px 0 0;">Instructions: ${reminder.instructions || 'Follow doctor\'s advice'}</p>
                                    </div>
                                    <p style="color: #666; font-size: 12px;">Sent by CureSense AI Health Assistant</p>
                                </div>
                            </div>
                        `
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error(`Error sending email to ${reminder.user.email}:`, error);
                        } else {
                            console.log(`Email sent to ${reminder.user.email}: ${info.response}`);
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Scheduler Error:', error);
        }
    });
};

module.exports = startScheduler;
