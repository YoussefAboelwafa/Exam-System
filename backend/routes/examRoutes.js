const {Router} = require('express');
const bookingController = require('../controllers/bookingControllers')

const router = Router();

router.get('/check_availability', bookingController.check_availability);

router.post('/pay_for_exam', bookingController.pay_for_exam);



module.exports = router;