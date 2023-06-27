const {Router} = require('express');
const authController = require('../controllers/authContollers')

const router = Router();

router.get('/sign_up', authController.signup_get);

router.post('/sign_up', authController.signup_post);

router.get('/login', authController.login_get);

router.post('/login', authController.login_post);

router.get('/logout', authController.logout_get);

router.post('/verify_code', authController.verifyCode);

module.exports = router;