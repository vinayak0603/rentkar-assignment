
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Partner = require('../models/Partner');
const Assignment = require('../models/Assignment');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    // Generate an order number if not provided
    if (!req.body.orderNumber) {
      req.body.orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    }
    
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'assigned', 'picked', 'delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign an order to a partner
router.post('/assign', async (req, res) => {
  try {
    const { orderId, partnerId } = req.body;
    
    // Find order and partner
    const order = await Order.findById(orderId);
    const partner = await Partner.findById(partnerId);
    
    if (!order) {
      // Create failed assignment record
      const failedAssignment = new Assignment({
        orderId,
        partnerId,
        status: 'failed',
        reason: 'Order not found'
      });
      await failedAssignment.save();
      
      return res.status(404).json({ 
        message: 'Order not found',
        assignment: failedAssignment
      });
    }
    
    if (!partner) {
      // Create failed assignment record
      const failedAssignment = new Assignment({
        orderId,
        partnerId,
        status: 'failed',
        reason: 'Partner not found'
      });
      await failedAssignment.save();
      
      return res.status(404).json({ 
        message: 'Partner not found',
        assignment: failedAssignment
      });
    }
    
    // Check if partner has capacity
    if (partner.currentLoad >= 3) {
      // Create failed assignment record
      const failedAssignment = new Assignment({
        orderId,
        partnerId,
        status: 'failed',
        reason: 'Partner is at maximum capacity'
      });
      await failedAssignment.save();
      
      return res.status(400).json({ 
        message: 'Partner is at maximum capacity',
        assignment: failedAssignment
      });
    }
    
    // Check if partner covers the area
    if (!partner.areas.includes(order.area)) {
      // Create failed assignment record
      const failedAssignment = new Assignment({
        orderId,
        partnerId,
        status: 'failed',
        reason: 'Partner does not cover this area'
      });
      await failedAssignment.save();
      
      return res.status(400).json({ 
        message: 'Partner does not cover this area',
        assignment: failedAssignment
      });
    }
    
    // Update order
    order.assignedTo = partnerId;
    order.status = 'assigned';
    await order.save();
    
    // Update partner's load
    partner.currentLoad += 1;
    await partner.save();
    
    // Create successful assignment record
    const assignment = new Assignment({
      orderId,
      partnerId,
      status: 'success'
    });
    await assignment.save();
    
    res.json({
      message: 'Order assigned successfully',
      assignment
    });
  } catch (error) {
    console.error('Error assigning order:', error);
    
    // Create failed assignment record
    try {
      const { orderId, partnerId } = req.body;
      const failedAssignment = new Assignment({
        orderId,
        partnerId,
        status: 'failed',
        reason: 'Server error'
      });
      await failedAssignment.save();
      
      res.status(500).json({ 
        message: 'Server error',
        assignment: failedAssignment
      });
    } catch (innerError) {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

module.exports = router;
