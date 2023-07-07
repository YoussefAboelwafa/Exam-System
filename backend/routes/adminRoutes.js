const {Router} = require('express');
const adminControllers = require('../controllers/adminControllers')



const router = Router();

router.post('/add_location', adminControllers.add_place);

router.post('/remove_location', adminControllers.remove_location);



router.post('/add_time', adminControllers.add_time);


//done
router.post('/add_exam', adminControllers.add_new_exam);

router.post('/edit_exam', adminControllers.edit_exam);

router.post('/remove_exam', adminControllers.remove_exam);

router.get('/get_day', adminControllers.get_users_with_day);

router.get('/get_all_days', adminControllers.get_all_days);

router.post('/get_users_with_day', adminControllers.get_users_with_day)

router.post('/delete_day', adminControllers.delete_day)

router.post('/set_percentage', adminControllers.set_percentage)

router.post('/turn_on_off', adminControllers.set_exam_status)

module.exports = router;