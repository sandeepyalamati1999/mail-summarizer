import Users from '../models/users.model';
import usersService from '../services/users.service';
import activityService from '../services/activity.service';
import respUtil from '../utils/resp.util';
import roleModel from '../models/roles.model';
import EmailService from '../services/email.service'
import serviceUtil from '../utils/service.util';
import config from '../config/config'
import i18nUtil from '../utils/i18n.util';
import sessionUtil from '../utils/session.util';
import listPreferencesModel from '../models/listPreferences.model.js';
const emailService = new EmailService()


const controller = "Users";

/**
 * Create new users
 * @param req
 * @param res
 * @returns { respCode: respCode, respMessage: respMessage }
 */
 async function register(req, res) {
    logger.info('Log:Users Controller:register: body :' + JSON.stringify(req.body), controller);
  
    await serviceUtil.checkPermission(req, res, "Edit", controller);
    if(req.body && req.body.email) req.body.email=req.body.email.toLowerCase()
    let users = new Users(req.body);
  
    //check email exists or not
    const uniqueEmail = await Users.findUniqueEmail(users.email);
    if (uniqueEmail) {
      req.i18nKey = 'emailExists';
      logger.error('Error:users Controller:register:' + i18nUtil.getI18nMessage('emailExists'), controller);
      return res.json(respUtil.getErrorResponse(req));
    }
    let requiredFieldError = await usersService.requriedFields(req)
    if(requiredFieldError){
      req.i18nKey = 'requriedField';
      return res.json(respUtil.getErrorResponse(req));
    }
    
    /*replace_*validateFieldData*/
    users = await usersService.setCreateUsersVariables(req, users)

    /**@create ListPreference for individual login type */
    let newListPreference = await new listPreferencesModel({columnOrder:config.columnOrder,usersId:users._id});
    /**@Saving the ListPreference */
    let savedPreference = await listPreferencesModel.saveData(newListPreference);
    /**@Assign that Preference to User */
    users.listPreferences = savedPreference._id;

    req.users = await Users.saveData(users);
    req.users.password = req.users.salt = undefined;
    req.entityType = 'users';
    req.activityKey = 'usersRegister';
    activityService.insertActivity(req);
    if (req.body.email) {
    emailService.sendEmailviaGrid({
        templateName: config.emailTemplates.usersCreate,
        entityType: sessionUtil.getLoginType(req),
        emailParams: {
            to: req.body.email
            // link: templateInfo.clientUrl + '#/changeRecoverPassword/' + req.token + '?active=true'
        }
    });
}
    //send email to users
    // emailService.sendEmail(req, res);
    // let templateInfo = JSON.parse(JSON.stringify(config.mailSettings));
    // emailService.sendEmailviaGrid({
    //   templateName: config.emailTemplates.usersWelcome,
    //   emailParams: {
    //     to: users.email,
    //     displayName: users.displayName,
    //     Id: req.users._id,
    //     link: templateInfo.adminUrl
    //   }
    // });
    logger.info('Log:users Controller:register:' + i18nUtil.getI18nMessage('usersCreate'), controller);
    return res.json(respUtil.createSuccessResponse(req));
  }
  

/**
 *  multiDelete users.
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function multidelete(req, res, next) {
  logger.info('Log:Users Controller:multidelete: query,body :' + JSON.stringify(req.query, req.body));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  if (req.body && req.body.selectedIds && req.body.selectedIds.length > 0) {
    await Users.updateMany(
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
  req.entityType = 'users';
  req.activityKey = 'usersDelete';
  // adding users delete activity
  activityService.insertActivity(req);
  res.json(respUtil.removeSuccessResponse(req));
};

/**
 * Get users
 * @param req
 * @param res
 * @returns {details: Users}
 */
async function get(req, res) {
  logger.info('Log:Users Controller:get: query :' + JSON.stringify(req.query));
  await serviceUtil.checkPermission(req, res, "View", controller);
  res.json({
    details: req.users
  });
}// import { Users } from "mocha";


/**
 * Get users list. based on criteria
 * @param req
 * @param res
 * @param next
 * @returns {users: users, pagination: pagination}
 */
async function list(req, res, next) {
  let users
  logger.info('Log:Users Controller:list: query :' + JSON.stringify(req.query));
  await serviceUtil.checkPermission(req, res, "View", controller);
  const query = await serviceUtil.generateListQuery(req,"users");
  query.pagination.totalCount = await Users.totalCount(query);
  
  req.entityType = 'users';
  query.dbfields = { password: 0, salt: 0, _v: 0 };
  if (req.query.type === 'exportToCsv') {
    query.limit = (query.pagination.totalCount>200) ? 200 : query.pagination.totalCount
  }
  users = await Users.list(query);
  res.json({
    users: users,
    pagination: query.pagination
  });
}


/**
 * Load users and append to req.
 * @param req
 * @param res
 * @param next
 */
async function load(req, res, next) {
  try{
    req.users = await Users.get(req.params.usersId);
    return next();
  }catch(err){
    req.i18nKey="idNotFound"
    return res.json(respUtil.getErrorResponse(req))
  }
}

/**
 * Create new users
 * @param req
 * @param res
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function create(req, res) {
  logger.info('Log:Users Controller:create: body :' + JSON.stringify(req.body), controller);

  await serviceUtil.checkPermission(req, res, "Edit", controller);
  if(req.body && req.body.email) req.body.email=req.body.email.toLowerCase()
  let users = new Users(req.body);
  let preCreateResult = await preCreate(users)
  //check email exists or not
  const uniqueEmail = await Users.findUniqueEmail(users.email);
  if (uniqueEmail) {
    req.i18nKey = 'emailExists';
    logger.error('Error:users Controller:create:' + i18nUtil.getI18nMessage('emailExists'), controller);
    return res.json(respUtil.getErrorResponse(req));
  }
  let requiredFieldError = await usersService.requriedFields(req)
  if(requiredFieldError){
    req.i18nKey = 'requriedField';
    return res.json(respUtil.getErrorResponse(req));
  }
  
  
  users = await usersService.setCreateUsersVariables(req, users)
  let validateRes = await usersService.validateFields(req, req.body);
              if(validateRes){
              return res.json(respUtil.getErrorResponse(req));
            }

  /**@create ListPreference for individual login type */
  let newListPreference = await new listPreferencesModel({columnOrder:config.columnOrder,usersId:users._id});
  /**@Saving the ListPreference */
  let savedPreference = await listPreferencesModel.saveData(newListPreference);
  /**@Assign that Preference to User */
  users.listPreferences = savedPreference._id;

  let preSaveCreateResult = await preSaveCreate(users)
  req.users = await Users.saveData(users);
  let postSaveCreateResult = await postSaveCreate(req.users)
  req.users.password = req.users.salt = undefined;
  req.entityType = 'users';
  req.activityKey = 'usersCreate';
  activityService.insertActivity(req);
  if (req.body.email) {
    emailService.sendEmailviaGrid({
        templateName: config.emailTemplates.usersCreate,
        entityType: sessionUtil.getLoginType(req),
        emailParams: {
            to: req.body.email
            // link: templateInfo.clientUrl + '#/changeRecoverPassword/' + req.token + '?active=true'
        }
    });
}
  //send email to users
  // emailService.sendEmail(req, res);
  // let templateInfo = JSON.parse(JSON.stringify(config.mailSettings));
  // emailService.sendEmailviaGrid({
  //   templateName: config.emailTemplates.usersWelcome,
  //   emailParams: {
  //     to: users.email,
  //     displayName: users.displayName,
  //     Id: req.users._id,
  //     link: templateInfo.adminUrl
  //   }
  // });
  logger.info('Log:users Controller:create:' + i18nUtil.getI18nMessage('usersCreate'), controller);
  return res.json(respUtil.createSuccessResponse(req));
}


/**
 * Update existing users
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function update(req, res, next) {
  logger.info('Log:Users Controller:update: body :' + JSON.stringify(req.body));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let users = req.users;
  let preUpdateResult = await preUpdate(users)
  
  req.description = await serviceUtil.compareObjects(users, req.body);
  users = Object.assign(users, req.body);
  users = await usersService.setUpdateUsersVariables(req, users);
  let validateRes = await usersService.validateFields(req, req.body);
              if(validateRes){
              return res.json(respUtil.getErrorResponse(req));
            }
  let preSaveUpdateResult = await preSaveUpdate(users)
  req.users = await Users.saveData(users);
  let postSaveUpdateResult = await postSaveUpdate(req.users)
  req.entityType = 'users';
  req.activityKey = 'usersUpdate';

  // adding users update activity
  activityService.insertActivity(req);
  res.json(respUtil.updateSuccessResponse(req));
}

/**
 * Delete users.
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function remove(req, res, next) {
  logger.info('Log:Users Controller:remove: query :' + JSON.stringify(req.query));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let users = req.users;
  let preRemoveResult = await preRemove(users)
  users.active = false;
  users = await usersService.setUpdateUsersVariables(req, users);
  let preSaveRemoveResult = await preSaveRemove(users)
  req.users = await Users.saveData(users);
  let postSaveRemoveResult = await postSaveRemove(req.users)
  req.entityType = 'users';
  req.activityKey = 'usersDelete';

  // adding users delete activity
  activityService.insertActivity(req);
  res.json(respUtil.removeSuccessResponse(req));
};async function multiupdate(req,res,next){
    logger.info('Log:Users Controller:multiupdate: query,body :' + JSON.stringify(req.body));
    await serviceUtil.checkPermission(req, res, "Edit", controller);
    if(req.body && req.body.selectedIds && req.body.selectedIds.length > 0  && req.body.updatedDetails){
      await Users.updateMany({ 
        _id:{ $in : req.body.selectedIds }
        },
        { $set: req.body.updatedDetails }
      )
    }
    req.entityType = 'users';
    req.activityKey = 'usersUpdate';
    activityService.insertActivity(req);
    res.json(respUtil.updateSuccessResponse(req));
  } const preCreate=async(users)=>{
    /**@Add Your custom Logic */
}  
  
const preSaveCreate=async(users)=>{
    /**@Add Your custom Logic */
} 
  
const postSaveCreate=async(users)=>{
    /**@Add Your custom Logic */
}
const preUpdate=async(users)=>{
    /**@Add Your custom Logic */
}  
  
const preSaveUpdate=async(users)=>{
    /**@Add Your custom Logic */
} 
  
const postSaveUpdate=async(users)=>{
    /**@Add Your custom Logic */
}
const preRemove=async(users)=>{
    /**@Add Your custom Logic */
}  
  
const preSaveRemove=async(users)=>{
    /**@Add Your custom Logic */
} 
  
const postSaveRemove=async(users)=>{
    /**@Add Your custom Logic */
}


export default {register,multidelete,get,list,load,create,update,remove,multiupdate}