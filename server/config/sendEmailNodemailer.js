import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const sendEmailNodemailer = async ({ sendTo, subject, html }) => {
    try {
        // Create transporter with Gmail SMTP
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_APP_PASSWORD // Use App Password, not regular password
            }
        })

        // Email options
        const mailOptions = {
            from: {
                name: 'Fresh Corner',
                address: process.env.GMAIL_EMAIL
            },
            to: sendTo,
            subject: subject,
            html: html
        }

        console.log('📧 Sending email via Gmail SMTP...')
        const result = await transporter.sendMail(mailOptions)
        console.log('✅ Email sent successfully via Gmail:', result.messageId)
        
        return result

    } catch (error) {
        console.error('❌ Gmail SMTP failed:', error.message)
        throw error
    }
}

export default sendEmailNodemailer