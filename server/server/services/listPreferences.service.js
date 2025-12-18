import ListPreferences from "../models/listPreferences.model";

import session from "../utils/session.util";
/**
 * set ListPreferences variables
 * @returns {ListPreferences}
 */
const setCreateListPreferencesVariables = async (req, listPreferences) => {
  if (req.tokenInfo) {
    listPreferences.createdBy = session.getSessionLoginID(req);
    listPreferences.userId = session.getSessionLoginID(req);
    listPreferences.userName = session.getSessionLoginName(req);
    listPreferences.createdByName = session.getSessionLoginName(req);
    listPreferences.userEmail = session.getSessionLoginEmail(req);
  }

  listPreferences.created = Date.now();
  return listPreferences;
};

/**
 * set ListPreferences update variables
 * @returns {ListPreferences}
 */
const setUpdateListPreferencesVariables = async (req, listPreferences) => {
  if (req.tokenInfo) {
    listPreferences.updatedBy = session.getSessionLoginID(req);
    listPreferences.updatedByName = session.getSessionLoginName(req);
  }
  //replace_encryptedFields
  listPreferences.updated = Date.now();
  return listPreferences;
};




export default {
  setCreateListPreferencesVariables,
  setUpdateListPreferencesVariables,
};
