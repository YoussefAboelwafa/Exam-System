const {Router} = require('express');
const examinationControllers = require('../controllers/examinationControllers')



const router = Router();

router.post('/home_bar', examinationControllers.get_exam);

// router.get('/get_all_days', adminControllers.get_all_days); //// change later so it only gives user what he needs

module.exports = router;