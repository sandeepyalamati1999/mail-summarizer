import express from 'express';
import paramValidate from '../config/param-validation';
import expressJwt from 'express-jwt';
import authCtrl from '../controllers/auth.controller';
import config from '../config/config';
import asyncHandler from 'express-async-handler';
import authPolicy from '../middlewares/authenticate';

/**@Webhooks */
import googleHooks from "../hooks/google.webhook";

const router = express.Router(); // eslint-disable-line new-cap

router.get("/google", authCtrl.googleLogin);
router.get("/google/webhook", googleHooks.googleLoginWebhook);


router.route('/socialLogin')
  .post(asyncHandler(authCtrl.googlelogin));
/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/login')
  .post(paramValidate.validateCheck('login'),
    asyncHandler(paramValidate.validate),
    asyncHandler(authCtrl.login));

router.route('/token').post(authPolicy.oauthToken, authCtrl.sendLoginResponse);

/** POST /api/auth/logout */
router.route('/logout').all(authPolicy.isAllowed)
  .post(authCtrl.logout);

/**POST /api/auth/sendotp - send email OTP *//** POST /api/auth/googleLogout */
router.route('/googleLogout').all(authPolicy.isAllowed)
  .post(authCtrl.googleLogout);  

router.route("/sendotp")
  .post(authCtrl.sendOTP);

/**POST /api/auth/verifyotp - if type email verify OTP| if type authenticator gives QR code response */
router.route("/verifyotp")
  .post(authCtrl.verifyOTP);

/**POST /api/auth/verifyAuthenticatorOTP - verify the google authenticator OTP */
router.route("/verifyAuthenticatorOTP")
  .post(authCtrl.verifyAuthenticatorOTP);  

router.route('/forgotPassword')
  .post(paramValidate.validateCheck('forgotPassword'),
    asyncHandler(paramValidate.validate), asyncHandler(authCtrl.forgotPassword))

router.route('/changeRecoverPassword')
  .post(paramValidate.validateCheck('changeRecoveryPassword'),
    asyncHandler(paramValidate.validate), asyncHandler(authCtrl.changeRecoverPassword))

router.route('/changePassword').all(authPolicy.isAllowed)
  .post(paramValidate.validateCheck('changePassword'),
    asyncHandler(paramValidate.validate), asyncHandler(authCtrl.changePassword))

/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header. Authorization: Bearer {token} */
router.route('/random-number')
  .get(expressJwt({ secret: config.jwtSecret, algorithms: ['RS256'] }), authCtrl.getRandomNumber);

module.exports = router;

