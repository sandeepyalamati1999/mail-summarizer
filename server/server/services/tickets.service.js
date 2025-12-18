import Tickets from "../models/tickets.model";

import session from "../utils/session.util";
import activityService from "./activity.service";
//replace_encryptedImport
import serviceUtil from "../utils/service.util";

let _ = require("lodash");
/**
 * set Tickets variables
 * @returns {Tickets}
 */
const setCreateTicketsVariables = async (req, tickets) => {
  if (req.tokenInfo) {
    tickets.createdBy = session.getSessionLoginID(req);
    tickets.userId = session.getSessionLoginID(req);
    tickets.userName = session.getSessionLoginName(req);
    tickets.createdByName = session.getSessionLoginName(req);
    // tickets.status = "Pending";
    tickets.userEmail = session.getSessionLoginEmail(req);
    //replace_encryptedFields
    let uniqueId = serviceUtil.generateRandomString(10, "#");
    let flag = true;
    while (flag) {
      let checkUser = await Tickets.findOne({ ticketId: uniqueId });
      if (checkUser) {
        uniqueId = serviceUtil.generateRandomString(10, "#");
      } else {
        tickets.ticketId = uniqueId;
        flag = false;
      }
    }
  }

  tickets.created = Date.now();
  return tickets;
};

/**
 * set Tickets update variables
 * @returns {Tickets}
 */
const setUpdateTicketsVariables = async (req, tickets) => {
  if (req.tokenInfo) {
    tickets.updatedBy = session.getSessionLoginID(req);
    tickets.updatedByName = session.getSessionLoginName(req);
  }
  //replace_encryptedFields
  tickets.updated = Date.now();
  return tickets;
};

/**@RelateAutoComplete for Bulk Upload */
const autoCompleteData = async (obj) => {
  let arrObj = [];
  for (let i of arrObj) {
    if (!i.isMultiple) {
      let query = {};
      query[i.searchField] = obj[i.bulkUploadField];
      query.active = true;
      obj[i.bulkUploadField] = await i.secureApi.findOne(query);
    } else {
      let resultarr = [];
      let searchFields = obj[i.bulkUploadField].split(",");
      for (let j of searchFields) {
        let query = { active: true };
        query[i.searchField] = j.trim();
        let findResult = await i.secureApi.findOne(query);
        if (findResult) resultarr.push(findResult);
      }
      obj[i.bulkUploadField] = resultarr;
    }
    if (obj && !obj[i.bulkUploadField])
      obj.reason = `${i.searchField} is not found`;
    console.log("AUTORELATE-->VAMSIII", obj[i.bulkUploadField]);
  }
  return obj;
};

/**
 * insert Employees bulk data
 * @returns {Employees}
 */
async function insertTicketsData(req, res) {
  req.duplicates = [];
  let obj = req.obj;
  for (let val in obj) {
    try {
      obj[val] = await autoCompleteData(obj[val]);
      let tickets = new Tickets(obj[val]);
      tickets = await setCreateTicketsVariables(req, tickets);
      let validateRes = await validateFields(req, tickets);
      if (validateRes) {
        obj[val].reason = req.errorMessage;
        req.duplicates.push(obj[val]);
        delete obj[val];
      }

      if (!validateRes) {
        req.tickets = await Tickets.saveData(tickets);
        req.entityType = "tickets";
        req.activityKey = "ticketsCreate";
        await activityService.insertActivity(req);
      }
    } catch (err) {
      obj[val].reason = "Error while creating Tickets" + err;
      req.duplicates.push(obj[val]);
      delete obj[val];
    }
  }
  return obj;
}

const validateFields = async (req, tickets) => {
  let isError = false;

  //replaceRequiredFields
  return isError;
};

/**@Validate bulkupload fields with csv Headers */
const validateTicketsBulkFields = async (req, res) => {
  let excelHeaders = req.headerKeys;
  let excelData = req.obj;
  req.duplicates = [];
  let bulkuploadFields = [
    "name",
    "subject",
    "description",
    "priority",
    "status",
    "category",
    "dateOfIssue",
    "dateOfSubmission",
    "resolutionDate",
  ];
  let unMatchedFields = _.difference(bulkuploadFields, excelHeaders);
  if (unMatchedFields && unMatchedFields.length > 0) {
    excelData = excelData.map((x) => ({ ...x, reason: "Headers not matched" }));
    req.duplicates = excelData;
    return {
      headersNotMatched: true,
      reason: `BulkUpload Fields (${unMatchedFields.join(
        ","
      )}) are Not Matched`,
    };
  }
  return { headersMatched: true };
};


const createNewTicketFromEmail = async (savedEmail) => {
  const createNewTicket = new Tickets({
    subject: savedEmail.subject,
    name: savedEmail.subject,
    category: "network",
    priority: "high",
    status: "new",
    dateOfIssue: new Date(),
    dateOfSubmission: new Date(),
    resolutionDate: new Date(),
    emailId: savedEmail._id,
  })

  await Tickets.saveData(createNewTicket);


}

export default {
  setCreateTicketsVariables,
  setUpdateTicketsVariables,
  insertTicketsData,
  validateFields,
  validateTicketsBulkFields,
  createNewTicketFromEmail
};
