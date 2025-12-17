import { Resend } from 'resend'
import dotenv from 'dotenv'
dotenv.config()

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

const sendEmailResend = async ({ sendTo, subject, html }) => {
    try {
        // Validate inputs
        if (!sendTo || !subject || !html) {
            throw new Error('Missing required email parameters: sendTo, subject, or html')
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(sendTo)) {
            throw new Error('Invalid email format')
        }

        console.log('📧 Attempting to send email via Resend to:', sendTo)

        const { data, error } = await resend.emails.send({
            from: 'Fresh Corner <onboarding@resend.dev>', // Resend's default sender
            to: [sendTo],
            subject: subject,
            html: html,
        })

        if (error) {
            console.error('❌ Resend API Error:', error)
            throw new Error(`Resend API Error: ${error.message}`)
        }

        console.log('✅ Email sent successfully via Resend:', data.id)
        return data

    } catch (error) {
        console.error('❌ Email sending failed:', error.message)
        throw new Error(`Failed to send email: ${error.message}`)
    }
}

export default sendEmailResend