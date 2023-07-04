const {Router} = require('express');
const naviController = require('../controllers/naviControllers')



const router = Router();

router.post('/test', naviController.populate_exams);

router.get('/home_bar', naviController.getHome);

router.post('/exams', naviController.getOtherExams)

router.get('/get_places', naviController.get_places);

router.get('/get_all_days', naviController.get_all_days)
// router.get('/get_all_days', adminControllers.get_all_days); //// change later so it only gives user what he needs

module.exports = router;