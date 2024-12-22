import Razorpay from 'razorpay';
import { Orders } from '../models/orders.js';

export const purchasePremium = (req, res) => {
    const rsp = new Razorpay({
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET
    });

    const amount = 30000; 

    rsp.orders.create({ amount, currency: 'INR' }, async (err, order) => {
        if (err) {
            console.error('Error creating Razorpay order:', err);
            return res.status(500).json({ error: 'Error creating order with Razorpay' });
        }

        if (!order) {
            console.error('No order returned from Razorpay');
            return res.status(500).json({ error: 'Failed to create Razorpay order' });
        }

        const orderid = order.id; 

        if (req.user) {
            try {
                await req.user.createOrder({
                    orderid: orderid,
                    status: 'PENDING',
                    amount: amount,
                });
                return res.status(201).json({
                    order,
                    key_id: rsp.key_id 
                });
            } catch (err) {
                console.error('Error saving order to the database:', err);
                return res.status(500).json({ error: 'Error saving order in database' });
            }
        } else {
            return res.status(401).json({ error: 'User not authenticated' });
        }
    });
};

export const updateTransaction = async (req, res) => {
    try {
        const { orderid, paymentid } = req.body;
        console.log(paymentid, orderid);
        const order = await Orders.findOne({ where: { orderid: orderid } });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found!' });
        }
        order.paymentid = paymentid;
        order.status = 'SUCCESSFUL'; 
        await order.save(); 
        const user = await req.user.update({ isPremium: true });
        return res.status(202).json({ success: true, message: 'Transaction Successful!' });
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: err.message });
    }
};






