import Filter from "../models/filters.model";

import session from "../utils/session.util";

/**
 * set Filter variables
 * @returns {Filter}
 */
const setCreateFilterVaribles = async (req, filter) => {
	if (req.tokenInfo) {
		filter.createdBy = session.getSessionLoginID(req);
		filter.createdByName = session.getSessionLoginName(req);
	}
	filter.created = Date.now();
	return filter;
};

/**
 * set Filter update variables
 * @returns {Filter}
 */
const setUpdateFilterVaribles = async (req, filter) => {
	filter.updated = Date.now();
	if (req.tokenInfo) {
		filter.updatedByName = session.getSessionLoginName(req);
		filter.updatedBy = session.getSessionLoginID(req);
	}
	return filter;
};

export default {
	setCreateFilterVaribles,
	setUpdateFilterVaribles,
};
