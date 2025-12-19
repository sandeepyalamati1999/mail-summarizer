/**@Packages */
import _ from "lodash";
import jwt from "jsonwebtoken"
/**@Models */
import Users from "../models/users.model";
import AccessToken from "../models/accessTokens.model";

/**@Services */
import activityService from "./activity.service";

/**@Utils */
import i18nService from "../utils/i18n.util";
import session from "../utils/session.util";

/**
 * set Users variables
 * @returns {Users}
 */
const setCreateUsersVariables = async (req, users) => {
  if (req.tokenInfo) {
    users.createdBy = session.getSessionLoginID(req);
    users.userId = session.getSessionLoginID(req);
    users.userName = session.getSessionLoginName(req);
    users.createdByName = session.getSessionLoginName(req);
    // users.status = "Pending";
    users.userEmail = session.getSessionLoginEmail(req);
    //replace_encryptedFields
    //replace_uniqueIdGeneration
  }

  users.created = Date.now();
  return users;
};

/**
 * set Users update variables
 * @returns {Users}
 */
const setUpdateUsersVariables = async (req, users) => {
  if (req.tokenInfo) {
    users.updatedBy = session.getSessionLoginID(req);
    users.updatedByName = session.getSessionLoginName(req);
  }
  //replace_encryptedFields
  //replace_valideFieldsCondtion
  users.updated = Date.now();
  return users;
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
async function insertUsersData(req, res) {
  req.duplicates = [];
  let obj = req.obj;
  for (let val in obj) {
    try {
      obj[val] = await autoCompleteData(obj[val]);
      let users = new Users(obj[val]);
      let validateRes = await validateFields(req, obj[val]);
      if (validateRes) {
        obj[val].reason = req.errorMessage;
        req.duplicates.push(obj[val]);
        delete obj[val];
      } else {
        const uniqueEmail = await Users.findUniqueEmail(users.email);
        if (uniqueEmail) {
          req.i18nKey = "emailExists";
          obj[val].reason = i18nService.getI18nMessage(req.i18nKey);
          req.duplicates.push(obj[val]);
          delete obj[val];
        } else {
          users = await setCreateUsersVariables(req, users);
          req.users = await Users.saveData(users);
          req.entityType = "users";
          req.activityKey = "usersCreate";
          await activityService.insertActivity(req);
        }
      }
    } catch (err) {
      obj[val].reason = "Error while creating Users" + err;
      req.duplicates.push(obj[val]);
      delete obj[val];
    }
  }
  return obj;
}


const validateFields = async (req, users) => {
  let isError = false;
  if (
    users.password &&
    !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      users.password
    )
  ) {
    req.errorMessage =
      "Password must contain at least 8 characters, one uppercase, one number and one special case character";
    isError = true;
    return isError;
  }
  //replaceRequiredFields
  return isError;
};

const requriedFields = async (req) => {
  let isError = false;
  /**@email required */
  if (
    (req && req.body && req.body.email && req.body.email.trim() == "") ||
    (req && req.body && !req.body.email)
  ) {
    isError = true;
  }
  /**@Password required */
  if (
    (req && req.body && req.body.password && req.body.password.trim() == "") ||
    (req && req.body && !req.body.password)
  ) {
    isError = true;
  }
  return isError;
};

/**@Validate bulkupload fields with csv Headers */
const validateUsersBulkFields = async (req, res) => {
  let excelHeaders = req.headerKeys;
  let excelData = req.obj;
  req.duplicates = [];
  let bulkuploadFields = ["userName", "phoneNo", "department", "location"];
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

async function insertUserAndAccessToken(req, data) {

  /**@CheckForExistingUser */
  const isUserExists = await Users.findOne({ active: true, email: data.email });

  /**@NotExists - creating user record. */
  if(!isUserExists) {
    req.newUser = new Users({
      email: data?.email,
      name: data?.name,
      picture: data?.picture,
      provider: data?.provider
    });
    req.user = await Users.saveData(req.newUser);

  }

  const deleteAccessTokens = await AccessToken.deleteMany({ email: data.email })
  console.log("ACCESS TOKENS DELETED ===> ", deleteAccessTokens);


  req.accessToken = new AccessToken({
    accessToken: data?.access_token,
    refreshToken: data?.refresh_token,
    scope: data?.scope,
    idToken: data?.id_token,
    expiryDate: data?.expiry_date,
    // refreshTokenExpiryDate: ,
    email: data?.email,
    name: data?.name,
    picture: data?.picture,
  })

  req.accessToken = await AccessToken.saveData(req.accessToken);
  return;

}



export default {
  setCreateUsersVariables,
  setUpdateUsersVariables,
  insertUsersData,
  validateFields,
  requriedFields,
  validateUsersBulkFields,
  insertUserAndAccessToken
};
