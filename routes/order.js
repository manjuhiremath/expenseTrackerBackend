import express from 'express';
import { purchasePremium, updateTransaction } from '../controllers/purchaseController.js';
import { authenticateUser } from '../middleware/auth.js';

const Router = express.Router();

Router.get('/purchasepremium',authenticateUser,purchasePremium);
Router.post('/updateorderstatus',authenticateUser,updateTransaction);



export default Router;
