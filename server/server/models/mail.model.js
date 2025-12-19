import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';





/**
 * Email Schema
 */
const MailSchema = new mongoose.Schema({
  provider: {
    type: String,
  },
  from: {
    type: String,
  },
  to: {
    type: String
  },
  cc: {
    type: Array,
  },
  bcc: {
    type: Array,
  },
  replyTo: {
    type: String,
  },
  subject: {
    type: String,
  },
  body: {
    type: String,
  },
  labels: {
    type: [String]
  },
  mimeType: {
    type: String,
  },
  snippet: {
    type: String
  },
  providerMessageId: {
    type: String,
  },
  threadId: {
    type: String,
  },
  receivedAt: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true
  }
}, { usePushEach: true, timestamps: true  });

/**
 * Statics
 */
MailSchema.statics = {
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
export default mongoose.model('Mails', MailSchema);
