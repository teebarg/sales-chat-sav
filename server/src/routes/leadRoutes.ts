import { Router } from 'express';
import { LeadController } from '../controllers/leadController';

const router = Router();
const leadController = new LeadController();

// Handle chat messages
router.post('/chat', leadController.handleMessage.bind(leadController));

// Get all leads (admin only)
router.get('/leads', leadController.getLeads.bind(leadController));

// Get lead by email
router.get('/leads/:email', leadController.getLeadByEmail.bind(leadController));

export default router;