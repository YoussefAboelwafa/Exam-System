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


module.exports = router;