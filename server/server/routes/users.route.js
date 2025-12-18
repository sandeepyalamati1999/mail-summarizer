import express from 'express';
import usersCtrl from '../controllers/users.controller';
import asyncHandler from 'express-async-handler';
import authPolicy from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';

const controller = "Users";
const router = express.Router();router
  .route("/multiUpdate")
  .all(authPolicy.isAllowed)
  /** POST /api/users/usersId - Delete users records */
  .post(asyncHandler(usersCtrl.multiupdate));
router
  .route("/register")
  /** POST /api/users - Register new users */
  .post(asyncHandler(usersCtrl.register));
router
  .route("/multiDelete")
  .all(authPolicy.isAllowed)
  /** POST /api/users/usersId - Delete users records */
  .post(asyncHandler(usersCtrl.multidelete));
router
  .route("/:usersId")
  .all(authPolicy.isAllowed)
  /** get /api/users/usersId -  get one users using id*/
  .get(asyncHandler(usersCtrl.get));
router
  .route("/")
  .all(authPolicy.isAllowed)
  /** get /api/users -  get all users */
  .get(asyncHandler(usersCtrl.list));
router.param("usersId", asyncHandler(usersCtrl.load));
router
  .route("/")
  .all(authPolicy.isAllowed)
  /** POST /api/users - Create new users */
  .post(asyncHandler(usersCtrl.create));
router
  .route("/:usersId")
  .all(authPolicy.isAllowed)
  /** get /api/users/usersId -  get one users using id*/
  .put(asyncHandler(usersCtrl.update));
router
  .route("/:usersId")
  .all(authPolicy.isAllowed)
  /** get /api/users/usersId -  get one users using id*/
  .delete(asyncHandler(usersCtrl.remove));


// export default router;
module.exports = router