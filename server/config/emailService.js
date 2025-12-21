import sendEmail from './sendEmail.js'
import dotenv from 'dotenv'
dotenv.config()

const emailService = async ({ sendTo, subject, html }) => {
    try {
        // Use only Brevo email service
        if (process.env.BREVO_API_KEY) {
            console.log('🔄 Sending email via Brevo...')
            const result = await sendEmail({ sendTo, subject, html })
            console.log('✅ Email sent successfully via Brevo')
            return result
        }

        throw new Error('Brevo API key not configured')

    } catch (error) {
        console.error('❌ Brevo email service failed:', error.message)
        
        // For development, simulate success
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