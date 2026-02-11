const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const User = require('../models/User');
const { sendEmail } = require('./emailService');

const startScheduler = () => {
    // Run every minute to check for reminders
    cron.schedule('* * * * *', async () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const currentTime = `${hours}:${minutes}`;

        console.log(`Checking reminders for time: ${currentTime}`);

        try {
            // Find reminders that match the current time
            const reminders = await Reminder.find({ time: currentTime }).populate('user');

            for (const reminder of reminders) {
                if (reminder.user && reminder.user.email) {
                    const emailContent = `
                        <h2>Time to take your medicine!</h2>
                        <p><strong>Medicine:</strong> ${reminder.medicineName}</p>
                        <p><strong>Dosage:</strong> ${reminder.dosage}</p>
                        <p><strong>Instructions:</strong> ${reminder.instructions || 'None'}</p>
                        <p>Stay healthy!</p>
                    `;

                    await sendEmail({
                        to: reminder.user.email,
                        subject: `Medicine Reminder: ${reminder.medicineName}`,
                        html: emailContent
                    });

                    console.log(`Reminder email sent to ${reminder.user.email} for ${reminder.medicineName}`);
                }
            }
        } catch (error) {
            console.error('Error in scheduler:', error);
        }
    });

    console.log('Scheduler service started successfully.');
};

module.exports = startScheduler;
