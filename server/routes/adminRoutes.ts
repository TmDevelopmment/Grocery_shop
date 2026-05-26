import express from 'express';
import { getAdminStats, getDeliveryPartners, createDeliveryPartner, updateDeliveryPartner, assignDeliveryPartner } from '../controller/adminController.js';
import admin from '../middlewares/admin.js';
import auth from '../middlewares/auth.js';

const adminRouter = express.Router();

adminRouter.get('/stats', getAdminStats);
adminRouter.get('/delivery-partners', getDeliveryPartners);
adminRouter.post('/delivery-partners', auth, admin, createDeliveryPartner);
adminRouter.put('/delivery-partners/:id', auth, admin, updateDeliveryPartner);
adminRouter.post('/orders/:id/assign', auth, admin, assignDeliveryPartner);

export default adminRouter;