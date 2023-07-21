const {Router} = require('express');
const examinationControllers = require('../controllers/examinationControllers')



const router = Router();

router.post('/get_exam', examinationControllers.get_exam);
router.post('/set_mcq_answer', examinationControllers.set_mcq_answer)

// router.get('/get_all_days', adminControllers.get_all_days); //// change later so it only gives user what he needs

module.exports = router;