
const express = require('express');
const router = express.Router();
const Partner = require('../models/Partner');

// Get all partners
router.get('/', async (req, res) => {
  try {
    const partners = await Partner.find();
    res.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific partner
router.get('/:id', async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    res.json(partner);
  } catch (error) {
    console.error('Error fetching partner:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new partner
router.post('/', async (req, res) => {
  try {
    const partner = new Partner(req.body);
    const savedPartner = await partner.save();
    res.status(201).json(savedPartner);
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a partner
router.put('/:id', async (req, res) => {
  try {
    const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    res.json(partner);
  } catch (error) {
    console.error('Error updating partner:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a partner
router.delete('/:id', async (req, res) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    res.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
