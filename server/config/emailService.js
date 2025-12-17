import sendEmailResend from './sendEmailResend.js'
import sendEmail from './sendEmail.js'
import sendEmailSMTP from './sendEmailSMTP.js'
import dotenv from 'dotenv'
dotenv.config()

const emailService = async ({ sendTo, subject, html }) => {
    try {
        // Try Resend first (no IP restrictions)
        if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_123456789_your_resend_api_key_here') {
            console.log('🔄 Attempting to send email via Resend...')
            try {
                const result = await sendEmailResend({ sendTo, subject, html })
                console.log('✅ Email sent successfully via Resend')
                return result
            } catch (resendError) {
                console.log('⚠️ Resend failed, trying Brevo...', resendError.message)
            }
        }

        // Fallback to Brevo
        if (process.env.BREVO_API_KEY) {
            console.log('🔄 Attempting to send email via Brevo...')
            try {
                const result = await sendEmail({ sendTo, subject, html })
                console.log('✅ Email sent successfully via Brevo')
                return result
            } catch (brevoError) {
                console.log('⚠️ Brevo failed, trying SMTP...', brevoError.message)
            }
        }

        // Fallback to SMTP
        if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
            console.log('🔄 Attempting to send email via SMTP...')
            try {
                const result = await sendEmailSMTP({ sendTo, subject, html })
                console.log('✅ Email sent successfully via SMTP')
                return result
            } catch (smtpError) {
                console.log('⚠️ SMTP also failed:', smtpError.message)
            }
        }

        throw new Error('No email service configured properly')

    } catch (error) {
        console.error('❌ All email services failed:', error.message)
        
        // For development, we can simulate success
        if (process.env.NODE_ENV === 'development') {
            console.log('🔧 Development mode: Simulating email success')
            console.log('📧 Would send email to:', sendTo)
            console.log('📝 Subject:', subject)
            return { 
                id: 'dev-simulation-' + Date.now(),
                message: 'Email simulated in development mode'
            }
        }
        
        throw error
    }
}

export default emailService