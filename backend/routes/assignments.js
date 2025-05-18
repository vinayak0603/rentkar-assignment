
const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Order = require('../models/Order');
const Partner = require('../models/Partner');

// Get all assignments
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('orderId')
      .populate('partnerId');
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get assignment metrics
router.get('/metrics', async (req, res) => {
  try {
    const allAssignments = await Assignment.find();
    const totalAssigned = allAssignments.length;
    const successfulAssignments = allAssignments.filter(a => a.status === 'success').length;
    const successRate = totalAssigned > 0 ? (successfulAssignments / totalAssigned) * 100 : 0;
    
    // Calculate failure reasons
    const failures = allAssignments.filter(a => a.status === 'failed');
    const reasonCounts = {};
    
    failures.forEach(failure => {
      const reason = failure.reason || 'Unknown';
      reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
    });
    
    const failureReasons = Object.keys(reasonCounts).map(reason => ({
      reason,
      count: reasonCounts[reason]
    }));
    
    res.json({
      totalAssigned,
      successRate,
      averageTime: 12, // This would need a more complex calculation
      failureReasons,
    });
  } catch (error) {
    console.error('Error fetching assignment metrics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Run automatic assignments
router.post('/run', async (req, res) => {
  try {
    // Get all pending orders
    const pendingOrders = await Order.find({ status: 'pending' });
    
    // Get all available partners
    const availablePartners = await Partner.find({
      status: 'active',
      currentLoad: { $lt: 3 }
    });
    
    const newAssignments = [];
    
    // Process each pending order
    for (const order of pendingOrders) {
      // Find partners available in the same area
      const partnersInArea = availablePartners.filter(p => 
        p.areas.includes(order.area)
      );
      
      if (partnersInArea.length > 0) {
        // Simple algorithm: assign to the partner with the lowest current load
        partnersInArea.sort((a, b) => a.currentLoad - b.currentLoad);
        const selectedPartner = partnersInArea[0];
        
        // Create assignment
        const assignment = new Assignment({
          orderId: order._id,
          partnerId: selectedPartner._id,
          status: 'success'
        });
        
        await assignment.save();
        newAssignments.push(assignment);
        
        // Update order
        order.assignedTo = selectedPartner._id;
        order.status = 'assigned';
        await order.save();
        
        // Update partner's load
        selectedPartner.currentLoad += 1;
        await selectedPartner.save();
        
        // Remove this partner from consideration if they're now at max load
        if (selectedPartner.currentLoad >= 3) {
          const index = availablePartners.findIndex(p => p._id.toString() === selectedPartner._id.toString());
          if (index !== -1) {
            availablePartners.splice(index, 1);
          }
        }
      } else {
        // Failed assignment - no partner available
        const assignment = new Assignment({
          orderId: order._id,
          status: 'failed',
          reason: 'No partners available in the area'
        });
        
        await assignment.save();
        newAssignments.push(assignment);
      }
    }
    
    res.json({
      message: `${newAssignments.filter(a => a.status === 'success').length} orders assigned successfully`,
      assignments: newAssignments
    });
  } catch (error) {
    console.error('Error running assignments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
