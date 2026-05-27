import express from 'express';
import { cancelDelivery, completeDelivery, getDeliveryDetails, getMyDeliveries, loginPartner, updateDeliveryStatus, updateLocation } from '../controller/deliveryPartnerController.js';
import deliveryAuth from '../middlewares/deliveryAuth.js';

const deliveryPartnerRouter = express.Router();

deliveryPartnerRouter.post('/login', loginPartner);
deliveryPartnerRouter.get('/my-deliveries', deliveryAuth, getMyDeliveries);
deliveryPartnerRouter.get('/my-deliveries/:id', deliveryAuth, getDeliveryDetails);
deliveryPartnerRouter.post('/my-deliveries/:id/complete', deliveryAuth, completeDelivery);
deliveryPartnerRouter.post('/my-deliveries/:id/cancel', deliveryAuth, cancelDelivery);
deliveryPartnerRouter.put('/my-deliveries/:id/status', deliveryAuth, updateDeliveryStatus);
deliveryPartnerRouter.post('/my-deliveries/:id/location', deliveryAuth, updateLocation);



export default deliveryPartnerRouter;
