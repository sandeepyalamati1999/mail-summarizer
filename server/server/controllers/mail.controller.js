
import Mail from '../models/mail.model';
import mailService from '../services/mail.service';
import activityService from '../services/activity.service';
import respUtil from '../utils/resp.util';
import serviceUtil from '../utils/service.util';
import i18nUtil from '../utils/i18n.util';

const controller = "Mail";

/**
 * Get mail
 * @param req
 * @param res
 * @returns {details: Mail}
 */
async function get(req, res) {
  logger.info('Log:Mail Controller:get: query :' + JSON.stringify(req.query));
  await serviceUtil.checkPermission(req, res, "View", controller);
  res.json({
    details: req.mail
  });
}

/**
 * Get mail list. based on criteria
 * @param req
 * @param res
 * @param next
 * @returns {mails: mails, pagination: pagination}
 */
async function list(req, res, next) {
  console.log("reswwwwwwwww", req.query)
  logger.info('Log:Mail Controller:list: query :' + JSON.stringify(req.query));
  await serviceUtil.checkPermission(req, res, "View", controller);
  const query = await serviceUtil.generateListQuery(req);

  if (query.page === 1) {
    // total count 
    query.pagination.totalCount = await Mail.totalCount(query);
  }
  req.entityType = 'mail';

  //get total mails
  query.sorting = { sequenceNo: 1 }
  const mails = await Mail.list(query);

  console.log("mailssss", JSON.stringify(mails))
  res.json({
    mails: mails,
    pagination: query.pagination
  });
}


/**
 * Update existing mail
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function update(req, res, next) {
  logger.info('Log:Mail Controller:update: body :' + JSON.stringify(req.body));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let mail = req.mail;
  mail = Object.assign(mail, req.body);
  mail = await mailService.setUpdateMailVaribles(req, mail);
  req.mail = await Mail.saveData(mail);
  req.entityType = 'mail';
  req.activityKey = 'mailUpdate';

  // adding mail update activity
  await activityService.insertActivity(req);
  res.json(respUtil.updateSuccessResponse(req));
}

/**
 * Create new mail
 * @param req
 * @param res
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function create(req, res) {
  logger.info('Log:Mail Controller:create: body :' + JSON.stringify(req.body));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let mail = new Mail(req.body);
  mail = await mailService.setCreateMailVaribles(req, mail);
  req.mail = await Mail.saveData(mail);
  req.entityType = 'mail';
  req.activityKey = 'mailCreate';

  // adding mail create activity
  await activityService.insertActivity(req);
  res.json(respUtil.createSuccessResponse(req));
}

/**
 * Delete mail.
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function remove(req, res, next) {
  logger.info('Log:Mail Controller:remove: query :' + JSON.stringify(req.query));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let mail = req.mail;
  mail.active = false;
  mail = await mailService.setUpdateMailVaribles(req, mail);
  req.mail = await Mail.saveData(mail);
  req.entityType = 'mail';
  req.activityKey = 'mailDelete';

  // adding mail delete activity
  await activityService.insertActivity(req);
  res.json(respUtil.removeSuccessResponse(req));
};

/**
 * Load mail and append to req.
 * @param req
 * @param res
 * @param next
 */
async function load(req, res, next) {
  req.mail = await Mail.get(req.params.mailId);
  return next();
}

export default { get, list, update, create, remove, load }