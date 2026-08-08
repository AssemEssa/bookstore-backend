import express from 'express';
import Order from '../models/Order.js';
import Book from '../models/Book.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shippingCost,
      total,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items',
      });
    }

    // Check stock availability for all items
    for (const item of items) {
      const book = await Book.findById(item.book);
      
      if (!book) {
        return res.status(404).json({
          success: false,
          message: `Book not found: ${item.title}`,
        });
      }

      if (book.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for "${book.title}". Available: ${book.stock}, Requested: ${item.quantity}`,
        });
      }
    }

    // Create the order
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shippingCost,
      total,
    });

    // Decrease stock for each item
    for (const item of items) {
      await Book.findByIdAndUpdate(
        item.book,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order placed successfully! Stock updated.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.book')
      .sort('-createdAt');

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.book');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user is order owner or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('items.book')
      .sort('-createdAt');

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { orderStatus, paymentStatus, cancellationReason } = req.body;

    const order = await Order.findById(req.params.id).populate('items.book');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const previousStatus = order.orderStatus;

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (cancellationReason !== undefined) order.cancellationReason = cancellationReason;

    if (orderStatus === 'delivered') {
      order.deliveredAt = Date.now();
    }

    // If order is cancelled, restore the stock
    if (orderStatus === 'cancelled' && previousStatus !== 'cancelled') {
      for (const item of order.items) {
        await Book.findByIdAndUpdate(
          item.book._id,
          { $inc: { stock: item.quantity } },
          { new: true }
        );
      }
    }

    await order.save();

    res.json({
      success: true,
      data: order,
      message: orderStatus === 'cancelled' ? 'Order cancelled and stock restored' : 'Order status updated',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.orderStatus !== 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Only cancelled orders can be deleted',
      });
    }

    await order.deleteOne();

    res.json({
      success: true,
      message: 'Cancelled order deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
