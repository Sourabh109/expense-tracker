const express = require('express');
const { body } = require('express-validator');
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/summary', getSummary);

router
  .route('/')
  .get(getTransactions)
  .post(
    [
      body('description').notEmpty().withMessage('Description is required').trim(),
      body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
      body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
      body('date').notEmpty().withMessage('Date is required'),
    ],
    createTransaction
  );

router
  .route('/:id')
  .get(getTransaction)
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
