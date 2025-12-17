import emailService from '../config/emailService.js'
import dotenv from 'dotenv'
dotenv.config()

const testEmailConfiguration = async () => {
    try {
        console.log('🧪 Testing email configuration...')
        console.log('📧 BREVO_EMAIL:', process.env.BREVO_EMAIL)
        console.log('🔑 BREVO_API_KEY exists:', !!process.env.BREVO_API_KEY)
        
        const testResult = await emailService({
            sendTo: process.env.BREVO_EMAIL, // Send to self for testing
            subject: 'Fresh Corner - Email Configuration Test',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #22c55e;">✅ Email Configuration Test</h2>
                    <p>This is a test email to verify that the Fresh Corner email system is working correctly.</p>
                    <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
                    <p style="color: #666;">If you receive this email, the configuration is working properly.</p>
                </div>
            `
        })
        
        console.log('✅ Email test successful!')
        return true
    } catch (error) {
        console.error('❌ Email test failed:', error.message)
        return false
    }
}

export default testEmailConfiguration