import fetch from 'node-fetch';
import dotenv from 'dotenv'
dotenv.config()

// Validate required environment variables
if(!process.env.BREVO_API_KEY){
    console.error("❌ BREVO_API_KEY is missing in .env file")
}
if(!process.env.BREVO_EMAIL){
    console.error("❌ BREVO_EMAIL is missing in .env file")
}

const sendEmail = async({sendTo, subject, html })=>{
    try {
        // Validate inputs
        if (!sendTo || !subject || !html) {
            throw new Error('Missing required email parameters: sendTo, subject, or html');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sendTo)) {
            throw new Error('Invalid email format');
        }

        console.log('📧 Attempting to send email to:', sendTo);
        
        const emailData = {
            sender: {
                name: "Fresh Corner",
                email: process.env.BREVO_EMAIL
            },
            to: [{
                email: sendTo,
                name: sendTo.split('@')[0] // Use email prefix as name
            }],
            subject: subject,
            htmlContent: html
        };
        
        console.log('🚀 Sending email via Brevo API...');
        
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(emailData)
        });
        
        const responseText = await response.text();
        
        if (!response.ok) {
            let errorData;
            try {
                errorData = JSON.parse(responseText);
            } catch {
                errorData = { message: responseText };
            }
            
            console.error('❌ Brevo API Error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData
            });
            
            throw new Error(`Brevo API Error (${response.status}): ${errorData.message || response.statusText}`);
        }
        
        const result = JSON.parse(responseText);
        console.log('✅ Email sent successfully:', result.messageId || 'Success');
        return result;
        
    } catch (error) {
        console.error('❌ Email sending failed:', error.message);
        
        // Log additional debug info
        if (error.message.includes('fetch')) {
            console.error('Network error - check internet connection');
        }
        
        throw new Error(`Failed to send email: ${error.message}`);
    }
}

export default sendEmail

