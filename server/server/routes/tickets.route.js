import express from 'express';
import ticketsCtrl from '../controllers/tickets.controller';
import asyncHandler from 'express-async-handler';
import authPolicy from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';

const controller = "Tickets";
const router = express.Router();router
  .route("/multiUpdate")
  .all(authPolicy.isAllowed)
  /** POST /api/tickets/ticketsId - Delete tickets records */
  .post(authorize("Edit", controller), asyncHandler(ticketsCtrl.multiupdate));
router
  .route("/multiDelete")
  .all(authPolicy.isAllowed)
  /** POST /api/tickets/ticketsId - Delete tickets records */
  .post(asyncHandler(ticketsCtrl.multidelete));
router
  .route("/:ticketsId")
  .all(authPolicy.isAllowed)
  /** get /api/tickets/ticketsId -  get one tickets using id*/
  .get(authorize("View", controller), asyncHandler(ticketsCtrl.get));
router
  .route("/")
  .all(authPolicy.isAllowed)
  /** get /api/tickets -  get all tickets */
  .get(authorize("View", controller), asyncHandler(ticketsCtrl.list));
router.param("ticketsId", asyncHandler(ticketsCtrl.load));
router
  .route("/")
  .all(authPolicy.isAllowed)
  /** POST /api/tickets - Create new tickets */
  .post(authorize("Edit", controller), asyncHandler(ticketsCtrl.create));
router
  .route("/:ticketsId")
  .all(authPolicy.isAllowed)
  /** get /api/tickets/ticketsId -  get one tickets using id*/
  .put(authorize("Edit", controller), asyncHandler(ticketsCtrl.update));
router
  .route("/:ticketsId")
  .all(authPolicy.isAllowed)
  /** get /api/tickets/ticketsId -  get one tickets using id*/
  .delete(authorize("Edit", controller), asyncHandler(ticketsCtrl.remove));


// export default router;
module.exports = router