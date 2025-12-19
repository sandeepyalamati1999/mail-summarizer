
import Tickets from '../models/tickets.model';
import Employee from '../models/employee.model';
import ticketsService from '../services/tickets.service';
import employeeService from '../services/employee.service';
import activityService from '../services/activity.service';
import respUtil from '../utils/resp.util';
import roleModel from '../models/roles.model';
import EmailService from '../services/email.service'
import serviceUtil from '../utils/service.util';
import config from '../config/config'
import i18nUtil from '../utils/i18n.util';
import sessionUtil from '../utils/session.util';
import listPreferencesModel from '../models/listPreferences.model.js';
import Emails from "../models/email.model.js";
const emailService = new EmailService()


const controller = "Tickets";

/**
 *  multiDelete tickets.
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function multidelete(req, res, next) {
  logger.info('Log:Tickets Controller:multidelete: query,body :' + JSON.stringify(req.query, req.body));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  if (req.body && req.body.selectedIds && req.body.selectedIds.length > 0) {
   let result =  await Tickets.updateMany(
      { _id: { $in: req.body.selectedIds } },
      {
        $set: {
          active: false,
          updated: new Date()
        }
      },
    );
    console.log("RESULS", result);
  }
  req.entityType = 'tickets';
  req.activityKey = 'ticketsDelete';
  // adding tickets delete activity
  activityService.insertActivity(req);
  res.json(respUtil.removeSuccessResponse(req));
};

/**
 * Get tickets
 * @param req
 * @param res
 * @returns {details: Tickets}
 */
async function get(req, res) {
  logger.info('Log:Tickets Controller:get: query :' + JSON.stringify(req.query));
  await serviceUtil.checkPermission(req, res, "View", controller);
  res.json({
    details: req.tickets
  });
}// import { Tickets } from "mocha";


/**
 * Get tickets list. based on criteria
 * @param req
 * @param res
 * @param next
 * @returns {tickets: tickets, pagination: pagination}
 */
async function list(req, res, next) {
  let tickets
  logger.info('Log:Tickets Controller:list: query :' + JSON.stringify(req.query));
  await serviceUtil.checkPermission(req, res, "View", controller);
  const query = await serviceUtil.generateListQuery(req,"tickets");
  query.pagination.totalCount = await Tickets.totalCount(query);
  
  // if (req.tokenInfo && req.tokenInfo._doc._id && req.tokenInfo._doc.role && req.tokenInfo._doc.role != 'Admin') {
  //   query.filter.createdBy = req.tokenInfo._id
  // }
  console.log("COOKKE", req.cookies.session)

  req.entityType = 'tickets';
  
  query.dbfields = { password: 0, salt: 0, _v: 0 };
  if (req.query.type === 'exportToCsv') {
    query.limit = (query.pagination.totalCount>200) ? 200 : query.pagination.totalCount
  } 
  console.log("STRINGIFY", JSON.stringify(query));
  tickets = await Tickets.list(query);
  res.json({
    tickets: tickets,
    pagination: query.pagination
  });
}


/**
 * Load tickets and append to req.
 * @param req
 * @param res
 * @param next
 */
async function load(req, res, next) {
  try{
    req.tickets = await Tickets.get(req.params.ticketsId);
    return next();
  }catch(err){
    req.i18nKey="idNotFound"
    return res.json(respUtil.getErrorResponse(req))
  }
}

/**
 * Create new tickets
 * @param req
 * @param res
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function create(req, res) {
  logger.info('Log:Tickets Controller:create: body :' + JSON.stringify(req.body));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let tickets = new Tickets(req.body); // tickets // TicketsFirst
  let preCreateResult = await preCreate(tickets)
  
  
  tickets = await ticketsService.setCreateTicketsVariables(req, tickets);
  let preSaveCreateResult = await preSaveCreate(tickets)
  req.tickets = await Tickets.saveData(tickets);
  let postSaveCreateResult = await postSaveCreate(req.tickets)
  req.entityType = 'tickets';
  req.activityKey = 'ticketsCreate';
  
  // adding tickets create activity
  activityService.insertActivity(req);
  res.json(respUtil.createSuccessResponse(req));
}

/**
 * Update existing tickets
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function update(req, res, next) {
  logger.info('Log:Tickets Controller:update: body :' + JSON.stringify(req.body));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let tickets = req.tickets;
  let preUpdateResult = await preUpdate(tickets)
  
  req.description = await serviceUtil.compareObjects(tickets, req.body);
  tickets = Object.assign(tickets, req.body);
  tickets = await ticketsService.setUpdateTicketsVariables(req, tickets);
  
  let preSaveUpdateResult = await preSaveUpdate(tickets)
  req.tickets = await Tickets.saveData(tickets);
  let postSaveUpdateResult = await postSaveUpdate(req.tickets)
  req.entityType = 'tickets';
  req.activityKey = 'ticketsUpdate';

  // adding tickets update activity
  activityService.insertActivity(req);
  res.json(respUtil.updateSuccessResponse(req));
}

/**
 * Delete tickets.
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function remove(req, res, next) {
  logger.info('Log:Tickets Controller:remove: query :' + JSON.stringify(req.query));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let tickets = req.tickets;
  let preRemoveResult = await preRemove(tickets)
  tickets.active = false;
  tickets = await ticketsService.setUpdateTicketsVariables(req, tickets);
  let preSaveRemoveResult = await preSaveRemove(tickets)
  req.tickets = await Tickets.saveData(tickets);
  let postSaveRemoveResult = await postSaveRemove(req.tickets)
  req.entityType = 'tickets';
  req.activityKey = 'ticketsDelete';

  // adding tickets delete activity
  activityService.insertActivity(req);
  res.json(respUtil.removeSuccessResponse(req));
};async function multiupdate(req,res,next){
    logger.info('Log:Tickets Controller:multiupdate: query,body :' + JSON.stringify(req.body));
    await serviceUtil.checkPermission(req, res, "Edit", controller);
    if(req.body && req.body.selectedIds && req.body.selectedIds.length > 0  && req.body.updatedDetails){
      await Tickets.updateMany({ 
        _id:{ $in : req.body.selectedIds }
        },
        { $set: req.body.updatedDetails }
      )
    }
    req.entityType = 'tickets';
    req.activityKey = 'ticketsUpdate';
    activityService.insertActivity(req);
    res.json(respUtil.updateSuccessResponse(req));
  } const preCreate=async(tickets)=>{
    /**@Add Your custom Logic */
}  
  
const preSaveCreate=async(tickets)=>{
    /**@Add Your custom Logic */
} 
  
const postSaveCreate=async(tickets)=>{
    /**@Add Your custom Logic */
}
const preUpdate=async(tickets)=>{
    /**@Add Your custom Logic */
}  
  
const preSaveUpdate=async(tickets)=>{
    /**@Add Your custom Logic */
} 
  
const postSaveUpdate=async(tickets)=>{
    /**@Add Your custom Logic */
}
const preRemove=async(tickets)=>{
    /**@Add Your custom Logic */
}  
  
const preSaveRemove=async(tickets)=>{
    /**@Add Your custom Logic */
} 
  
const postSaveRemove=async(tickets)=>{
    /**@Add Your custom Logic */
}


export default {multidelete,get,list,load,create,update,remove,multiupdate}