
import ListPreferences from '../models/listPreferences.model';
import Employee from '../models/employee.model';
import listPreferencesService from '../services/listPreferences.service';
import activityService from '../services/activity.service';
import respUtil from '../utils/resp.util';
import EmailService from '../services/email.service'
import serviceUtil from '../utils/service.util';
const emailService = new EmailService()


const controller = "ListPreferences";

/**
 *  multiDelete listPreferences.
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function multidelete(req, res, next) {
  logger.info('Log:ListPreferences Controller:multidelete: query,body :' + JSON.stringify(req.query, req.body));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  if (req.body && req.body.selectedIds && req.body.selectedIds.length > 0) {
    await ListPreferences.updateMany(
      { _id: { $in: req.body.selectedIds } },
      {
        $set: {
          active: false,
          updated: new Date()
        }
      },
      { multi: true }
    );
  }
  req.entityType = 'listPreferences';
  req.activityKey = 'listPreferencesDelete';
  // adding listPreferences delete activity
  activityService.insertActivity(req);
  res.json(respUtil.removeSuccessResponse(req));
};

/**
 * Get listPreferences
 * @param req
 * @param res
 * @returns {details: ListPreferences}
 */
async function get(req, res) {
  logger.info('Log:ListPreferences Controller:get: query :' + JSON.stringify(req.query));
  await serviceUtil.checkPermission(req, res, "View", controller);
  res.json({
    details: req.listPreferences
  });
}


/**
 * Get listPreferences list. based on criteria
 * @param req
 * @param res
 * @param next
 * @returns {listPreferences: listPreferences, pagination: pagination}
 */
async function list(req, res, next) {
  let listPreferences
  logger.info('Log:ListPreferences Controller:list: query :' + JSON.stringify(req.query));
  await serviceUtil.checkPermission(req, res, "View", controller);
  const query = await serviceUtil.generateListQuery(req);
  if (query.page === 1) {
    // total count 
    query.pagination.totalCount = await ListPreferences.totalCount(query);
  }
  let roleDetails = {}
  req.entityType = 'listPreferences';

  query.dbfields = { password: 0, salt: 0, _v: 0 };
  if (req.query.type === 'exportToCsv') {
    query.limit = (query.pagination.totalCount>200) ? 200 : query.pagination.totalCount
  } 
  listPreferences = await ListPreferences.list(query);

  res.json({
    listPreferences: listPreferences,
    pagination: query.pagination
  });
}


/**
 * Load listPreferences and append to req.
 * @param req
 * @param res
 * @param next
 */
async function load(req, res, next) {
  req.listPreferences = await ListPreferences.get(req.params.listPreferencesId);
  return next();
}

/**
 * Create new listPreferences
 * @param req
 * @param res
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function create(req, res) {
  logger.info('Log:ListPreferences Controller:create: body :' + JSON.stringify(req.body));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let listPreferences = new ListPreferences(req.body); // listPreferences // ListPreferencesFirst

  /**Add the employeeId */
  listPreferences = await listPreferencesService.setCreateListPreferencesVariables(req, listPreferences);
  req.listPreferences = await ListPreferences.saveData(listPreferences);

  /**@Update the Employee Record add listPreference Key */
  let findEmployee = await Employee.findOne({_id:req.tokenInfo._id,active:true});
  if(findEmployee){
    findEmployee.listPreferences = req.listPreferences._id;
    await Employee.saveData(findEmployee);
  }

  req.entityType = 'listPreferences';
  req.activityKey = 'listPreferencesCreate';


  
  // adding listPreferences create activity
  activityService.insertActivity(req);
  res.json(respUtil.createSuccessResponse(req));
}

/**
 * Update existing listPreferences
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function update(req, res, next) {
  logger.info('Log:ListPreferences Controller:update: body :' + JSON.stringify(req.body));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let listPreferences = req.listPreferences;
  
  //req.description = await serviceUtil.compareObjects(listPreferences, req.body);

  listPreferences.columnOrder = {...listPreferences.columnOrder,...req.body}
  listPreferences.employeeId = req.tokenInfo._id.toString();
  listPreferences = await listPreferencesService.setUpdateListPreferencesVariables(req, listPreferences);
  
  req.listPreferences = await ListPreferences.saveData(listPreferences);
  req.entityType = 'listPreferences';
  req.activityKey = 'listPreferencesUpdate';

  // adding listPreferences update activity
  activityService.insertActivity(req);
  res.json(respUtil.updateSuccessResponse(req));
}

/**
 * Delete listPreferences.
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function remove(req, res, next) {
  logger.info('Log:ListPreferences Controller:remove: query :' + JSON.stringify(req.query));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let listPreferences = req.listPreferences;
  listPreferences.active = false;
  listPreferences = await listPreferencesService.setUpdateListPreferencesVariables(req, listPreferences);
  req.listPreferences = await ListPreferences.saveData(listPreferences);
  req.entityType = 'listPreferences';
  req.activityKey = 'listPreferencesDelete';

  // adding listPreferences delete activity
  activityService.insertActivity(req);
  res.json(respUtil.removeSuccessResponse(req));
};

export default {multidelete,get,list,load,create,update,remove}