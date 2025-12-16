import fetch from 'node-fetch';
import dotenv from 'dotenv'
dotenv.config()

if(!process.env.BREVO_API_KEY){
    console.log("Provide BREVO_API_KEY in the .env file")
}

const sendEmail = async({sendTo, subject, html })=>{
    try {
        console.log('Attempting to send email to:', sendTo);
        
        const emailData = {
            sender: {
                name: process.env.EMAIL_FROM || "Fresh Corner",
                email: process.env.BREVO_EMAIL
            },
            to: [{
                email: sendTo
            }],
            subject: subject,
            htmlContent: html
        };
        
        console.log('Sending email via Brevo API...');
        
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Brevo API Error:', errorData);
            throw new Error(`Brevo API Error: ${errorData.message || response.statusText}`);
        }
        
        const result = await response.json();
        console.log('Email sent successfully:', result);
        return result;
    } catch (error) {
        console.error('Email sending failed:', error.message);
        throw new Error(`Email sending failed: ${error.message}`);
    }
}

export default sendEmail

