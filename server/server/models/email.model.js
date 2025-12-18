import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const Schema = mongoose.Schema;

/**
 * Default Scheamas
 */
let defaultSchemaValues = {
    from: String,
    to: String,
    subject: String,
    replyTo: String,
    body: String,
    receivedDate: Date,
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date
  },
  active: {
    type: Boolean,
    default: true
  },
  createdByName: String,
  updatedByName: String,
  
};


/**
 * Email Schema
 */
const EmailSchema = new mongoose.Schema({
  ...defaultSchemaValues,
}, { usePushEach: true });

/**
 * Statics
 */
EmailSchema.statics = {
  /**
   * save and update email
   * @param email
   * @returns {Promise<Email, APIError>}
   */
  saveData(email) {
    return email.save()
      .then((email) => {
        if (email) {
          return email;
        }
        const err = new APIError('Error in email', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * Get email
   * @param {ObjectId} id - The objectId of email.
   * @returns {Promise<Email, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((email) => {
        if (email) {
          return email;
        }
        const err = new APIError('No such email exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List email in descending order of 'createdAt' timestamp.
   * @returns {Promise<Email[]>}
   */
  list(query) {
    return this.find(query.filter)
      .sort(query.sorting)
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .exec();
  },
  /**
   * Count of email records
   * @returns {Promise<Email[]>}
   */
  totalCount(query) {
    return this.find(query.filter)
      .countDocuments();
  }

};

/**
 * @typedef Email
 */
export default mongoose.model('Emails', EmailSchema);
