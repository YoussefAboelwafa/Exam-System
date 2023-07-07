const {Router} = require('express');
const bookingController = require('../controllers/bookingControllers')

const router = Router();

// router.get('/check_availability', bookingController.check_availability);

router.post('/book_exam', bookingController.book_exam);

router.post('/get_token', bookingController.startPayment)

module.exports = router;