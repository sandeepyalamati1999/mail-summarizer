import express from 'express';
import mailCtrl from '../controllers/mail.controller';
import asyncHandler from 'express-async-handler';
import authPolicy from '../middlewares/authenticate';

const router = express.Router();

router.route('/:mailId')
  /** get /api/mails/mailId -  get one mail using id*/
  .get(asyncHandler(mailCtrl.get))

router.route('/')
  /** get /api/mails -  get all mails */
  .get(asyncHandler(mailCtrl.list));

router.route('/:mailId')
  /** get /api/mails/mailId -  get one mail using id*/
  .put(asyncHandler(mailCtrl.update));

router.route('/')
  /** POST /api/mails - Create new mails */
  .post(asyncHandler(mailCtrl.create))

router.route('/:mailId')
  /** get /api/mails/mailId -  get one mail using id*/
  .delete(asyncHandler(mailCtrl.remove));

router.param('mailId', asyncHandler(mailCtrl.load));

// export default router;
module.exports = router