import ContactModel from "../models/contact.model.js";
import sendEmail from '../config/sendEmail.js';
import contactReplyTemplate from '../utils/contactReplyTemplate.js';
import UserModel from '../models/user.model.js';

// Submit contact form
export async function submitContactController(request, response) {
    try {
        const { name, email, phone, subject, message } = request.body;

        if (!name || !email || !phone || !subject || !message) {
            return response.status(400).json({
                message: "All fields are required",
                error: true,
                success: false
            });
        }

        const contact = new ContactModel({
            name,
            email,
            phone,
            subject,
            message
        });

        const savedContact = await contact.save();

        return response.json({
            message: "Contact form submitted successfully",
            error: false,
            success: true,
            data: savedContact
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Get all contacts (Admin only)
export async function getAllContactsController(request, response) {
    try {
        const contacts = await ContactModel.find({}).sort({ createdAt: -1 });

        return response.json({
            message: "Contacts retrieved successfully",
            error: false,
            success: true,
            data: contacts
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Update contact status (Admin only)
export async function updateContactStatusController(request, response) {
    try {
        const { contactId } = request.params;
        const { status } = request.body;

        if (!['new', 'read', 'replied'].includes(status)) {
            return response.status(400).json({
                message: "Invalid status",
                error: true,
                success: false
            });
        }

        const updatedContact = await ContactModel.findByIdAndUpdate(
            contactId,
            { status },
            { new: true }
        );

        if (!updatedContact) {
            return response.status(404).json({
                message: "Contact not found",
                error: true,
                success: false
            });
        }

        return response.json({
            message: "Contact status updated successfully",
            error: false,
            success: true,
            data: updatedContact
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Delete contact (Admin only)
export async function deleteContactController(request, response) {
    try {
        const { contactId } = request.params;

        const deletedContact = await ContactModel.findByIdAndDelete(contactId);

        if (!deletedContact) {
            return response.status(404).json({
                message: "Contact not found",
                error: true,
                success: false
            });
        }

        return response.json({
            message: "Contact deleted successfully",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Reply to contact via email (Admin only)
export async function replyToContactController(request, response) {
    try {
        const { contactId } = request.params;
        const { replyMessage } = request.body;
        const adminUserId = request.userId;

        if (!replyMessage) {
            return response.status(400).json({
                message: "Reply message is required",
                error: true,
                success: false
            });
        }

        const contact = await ContactModel.findById(contactId);
        if (!contact) {
            return response.status(404).json({
                message: "Contact not found",
                error: true,
                success: false
            });
        }

        const admin = await UserModel.findById(adminUserId);
        if (!admin) {
            return response.status(404).json({
                message: "Admin not found",
                error: true,
                success: false
            });
        }

        // Send reply email
        try {
            await sendEmail({
                sendTo: contact.email,
                subject: `Re: ${contact.subject} - Fresh Corner Support`,
                html: contactReplyTemplate({
                    customerName: contact.name,
                    customerMessage: contact.message,
                    adminReply: replyMessage,
                    adminName: admin.name
                })
            });

            // Update contact status to replied
            await ContactModel.findByIdAndUpdate(contactId, { status: 'replied' });

            return response.json({
                message: "Reply sent successfully",
                error: false,
                success: true
            });

        } catch (emailError) {
            return response.status(500).json({
                message: "Failed to send email reply",
                error: true,
                success: false
            });
        }

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}