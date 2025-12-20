import { Router } from 'express';
import { submitContactController, getAllContactsController, updateContactStatusController, deleteContactController, replyToContactController } from '../controllers/contact.controller.js';
import auth from '../middleware/auth.js';
import { admin } from '../middleware/Admin.js';

const contactRouter = Router();

// Public route - submit contact form
contactRouter.post('/submit', submitContactController);

// Admin routes - manage contacts
contactRouter.get('/get', auth, admin, getAllContactsController);
contactRouter.put('/update-status/:contactId', auth, admin, updateContactStatusController);
contactRouter.post('/reply/:contactId', auth, admin, replyToContactController);
contactRouter.delete('/delete/:contactId', auth, admin, deleteContactController);

export default contactRouter;