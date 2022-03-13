var router = require('express').Router();
const {body} = require('express-validator');
const {transaction} = require('../../../controllers/v1/transaction');
const {getQuote} = require('../../../controllers/v1/quote');

router.use('/auth', require('./auth/index'));

router.get('/quote',getQuote);

router.post('/transaction', [
    body('trx_id',"Input Tnsaction ID!")
    .notEmpty()
    .isString()
    .withMessage('Please enter a string'),
    body('amount',"Input Amount!")
    .notEmpty()
    .isFloat()
    .withMessage('Please enter a float'),
    body('user_id',"Input User ID!")
    .notEmpty()
    .isInt()
    .withMessage('Please enter a integer')
], transaction);

module.exports = router;