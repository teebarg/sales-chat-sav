import { Router } from 'express';
import { LeadController } from '../controllers/leadController';

const router = Router();
const leadController = new LeadController();

router.post('/chat', leadController.handleMessage.bind(leadController));

router.get('/leads', leadController.getLeads.bind(leadController));

router.get('/leads/:email', leadController.getLeadByEmail.bind(leadController));

export default router;