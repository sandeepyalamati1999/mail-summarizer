import Mail from '../models/mail.model';

import session from '../utils/session.util';

/**
 * set Mail variables
 * @returns {Mail}
 */
const setCreateMailVaribles = async (req, mail) => {
  if (req.tokenInfo) {
    mail.userId = session.getSessionLoginID(req);
    mail.createdByName = session.getSessionLoginName(req);
    mail.status = "Pending";
    mail.userEmail = session.getSessionLoginEmail(req);
  };
  mail.created = Date.now();
  return mail;
};


/**
 * set Mail update variables
 * @returns {Mail}
 */
const setUpdateMailVaribles = async (req, mail) => {
  mail.updated = Date.now();
  if (req.tokenInfo) {
    mail.updatedByName = session.getSessionLoginName(req);
  }
  return mail;
};

export default {
  setCreateMailVaribles,
  setUpdateMailVaribles,
};