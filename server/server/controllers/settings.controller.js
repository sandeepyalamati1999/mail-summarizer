import Settings from '../models/settings.model';

import activityService from '../services/activity.service';
import errorService from '../services/error.service';

import i18nUtil from '../utils/i18n.util';
import respUtil from '../utils/resp.util';
import serviceUtil from '../utils/service.util';
import sessionUtil from '../utils/session.util';

const controller = "Settings";


/**
 * Load Settings and append to req.
 * @param req
 * @param res
 * @param next
 */
async function load(req, res, next) {
  req.settings = await Settings.get(req.params.settingsId);
  return next();
}


/**
 * Get settings
 * @param req
 * @param res
 * @returns {details: settings}
 */

async function get(req, res) {
  logger.info('Log:settings Controller:get: query :' + JSON.stringify(req.query), controller);

  await serviceUtil.checkPermission(req, res, "View", controller);
  req.query = await serviceUtil.generateListQuery(req);
  let settings = req.settings;
  logger.info('Log:settings Controller:get:' + i18nUtil.getI18nMessage('recordFound'), controller);
  let responseJson = {
    respCode: respUtil.getDetailsSuccessResponse().respCode,
    details: settings
  };
  return res.json(responseJson);
}
/**
 * Create new settings
 * @param req
 * @param res
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function create(req, res) {
  logger.info('Log:settings Controller:cretae: body :' + JSON.stringify(req.body), controller);

  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let settings = new Settings(req.body);
  if (sessionUtil.checkTokenInfo(req, '_id') && sessionUtil.checkTokenInfo(req, 'loginType'))
    settings.createdBy[sessionUtil.getTokenInfo(req, 'loginType')] = sessionUtil.getTokenInfo(req, '_id');

  if (req.body.expireTokenTimeInMin)
    settings.expireTokenTime = req.body.expireTokenTimeInMin * 60 * 1000;

  if (req.body.adminExpireTokenTimeInMin)
    settings.adminExpireTokenTime = req.body.adminExpireTokenTimeInMin * 60 * 1000;

  req.settings = await Settings.saveData(settings);
  req.entityType = 'settings';
  req.activityKey = 'settingsCreate';
  activityService.insertActivity(req);
  req.errorKey = 'settingsCreate';
  errorService.insertActivity(req);
  logger.info('Log:settings Controller:create:' + i18nUtil.getI18nMessage('settingsCreate'), controller);
  return res.json(respUtil.createSuccessResponse(req));
}

/**
 * Update existing settings
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function update(req, res, next) {
  logger.info('Log:settings Controller:update: body :' + JSON.stringify(req.body), controller);

  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let settings = req.settings;
  req.description = await serviceUtil.compareObjects(settings, req.body);

  settings = Object.assign(settings, req.body);
  // if (sessionUtil.checkTokenInfo(req, '_id') && sessionUtil.checkTokenInfo(req, 'loginType'))
  //   settings.updatedBy[sessionUtil.getTokenInfo(req, 'loginType')] = sessionUtil.getTokenInfo(req, '_id');

  if (req.tokenInfo) {
    settings.updatedBy.user = req.tokenInfo._id
  }
  if (req.body.adminExpireTokenTimeInMin)
    settings.adminExpireTokenTime = req.body.adminExpireTokenTimeInMin * 60 * 1000;

  if (req.body.expireTokenTimeInMin)
    settings.expireTokenTime = req.body.expireTokenTimeInMin * 60 * 1000;

  settings.updated = Date.now();
  req.settings = await Settings.saveData(settings);
  req.entityType = 'settings';
  req.activityKey = 'settingsUpdate';
  activityService.insertActivity(req);
  req.errorKey = 'settingsUpdate';
  errorService.insertActivity(req);
  logger.info('Log:settings Controller:update:' + i18nUtil.getI18nMessage('settingsUpdate'), controller);
  return res.json(respUtil.updateSuccessResponse(req));
}

/**
 * Get settings list. based on criteria
 * @param req
 * @param res
 * @param next
 * @returns {settings: settings, pagination: pagination}
 */
async function list(req, res, next) {
  logger.info('Log:settings Controller:list: query :' + JSON.stringify(req.query), controller);
  await serviceUtil.checkPermission(req, res, "View", controller);
  let responseJson = {};
  const query = await serviceUtil.generateListQuery(req);
  if (query.page === 1)
    //  total count;
    query.pagination.totalCount = await Settings.totalCount(query);

  //get total settings
  const settings = await Settings.list(query);
  logger.info('Log:settings Controller:list:' + i18nUtil.getI18nMessage('recordsFound'), controller);
  responseJson.respCode = respUtil.getDetailsSuccessResponse().respCode;
  responseJson.settings = settings;
  responseJson.pagination = query.pagination;
  return res.json(responseJson)
}

/**
 * Delete settings.
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function remove(req, res, next) {
  logger.info('Log:settings Controller:remove: query :' + JSON.stringify(req.query), controller);
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  const settings = req.settings;
  settings.active = false;

  if (sessionUtil.checkTokenInfo(req, '_id') && sessionUtil.checkTokenInfo(req, 'loginType'))
    settings.updatedBy[sessionUtil.getTokenInfo(req, 'loginType')] = sessionUtil.getTokenInfo(req, '_id');

  settings.updated = Date.now();
  req.settings = await Settings.saveData(settings);
  req.entityType = 'settings';
  req.activityKey = 'settingsDelete';
  activityService.insertActivity(req);
  req.errorKey = 'settingsDelete';
  errorService.insertActivity(req);
  logger.info('Log:settings Controller:remove:' + i18nUtil.getI18nMessage('settingsDelete'), controller);
  return res.json(respUtil.removeSuccessResponse(req));
}

export default {
  load,
  get,
  create,
  update,
  list,
  remove
};
