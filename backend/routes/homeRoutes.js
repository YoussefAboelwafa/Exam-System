const {Router} = require('express');
const naviController = require('../controllers/naviControllers')



const router = Router();

router.post('/test', naviController.populate_exams);

router.get('/home_bar', naviController.getHome);

router.post('/exams', naviController.getOtherExams)


module.exports = router;