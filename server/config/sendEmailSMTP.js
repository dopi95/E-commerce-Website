import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const sendEmailSMTP = async ({ sendTo, subject, html }) => {
    try {
        // Create transporter using Gmail SMTP
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL || process.env.BREVO_EMAIL,
                pass: process.env.SMTP_PASSWORD || 'your-app-password-here'
            }
        })

        console.log('📧 Attempting to send email via SMTP to:', sendTo)

        const mailOptions = {
            from: `"Fresh Corner" <${process.env.SMTP_EMAIL || process.env.BREVO_EMAIL}>`,
            to: sendTo,
            subject: subject,
            html: html
        }

        const result = await transporter.sendMail(mailOptions)
        console.log('✅ Email sent successfully via SMTP:', result.messageId)
        return result

    } catch (error) {
        console.error('❌ SMTP email sending failed:', error.message)
        throw new Error(`Failed to send email via SMTP: ${error.message}`)
    }
}

export default sendEmailSMTP