import express from 'express';
import User from '../models/User.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (admin only)
 * @access  Private/Admin
 */
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '_id name email role');
    res.json({ users }); // send as { users: [...] } to be consistent
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

/**
 * @route   PUT /api/admin/change/role/:id
 * @desc    Change user role by ID (admin only)
 * @access  Private/Admin
 */
router.put('/change/role/:id', verifyToken, isAdmin, async (req, res) => {
  const { role } = req.body;
  const validRoles = ['Admin', 'ProjectLead', 'Developer'];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    res.json({ message: 'Role updated successfully', updatedUser: { _id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    console.error('Error updating role:', err);
    res.status(500).json({ message: 'Failed to update role' });
  }
});

export default router;
