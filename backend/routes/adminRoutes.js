const {Router} = require('express');
const adminControllers = require('../controllers/adminControllers')



const router = Router();

router.post('/addPlace', adminControllers.add_place);



module.exports = router;