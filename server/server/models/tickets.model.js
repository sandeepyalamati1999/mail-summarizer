import Promise from "bluebird";
import mongoose from "mongoose";
import httpStatus from "http-status";
import APIError from "../helpers/APIError";

const TicketsSchemaJson = require("../schemas/tickets.json");
const Schema = mongoose.Schema;

/**
 * Default Scheamas
 */
let defaultSchemaValues = {
  // created: {
  //   type: Date
  // },
  // updated: {
  //   type: Date
  // },
  // createdBy: {
  //   type: String
  // },
  active: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: Schema.ObjectId,
  },
  createdByName: String,
  updatedByName: String,
  emailId: {
    type: Schema.ObjectId,
    ref: "Emails",
  },
  created: {
    type: Date,
    default: Date.now,
  }

};

// let json = JSON.parse(JSON.stringify(TicketsSchemaJson));
// for(let i in json){
//   if(typeof json[i] == 'object' && json[i].match){
//     let substring = json[i].match;
//     substring = substring.substr(1,substring.length-3);
//     console.log(substring);
//     json[i].match = new RegExp(substring);
//   }
// }

/**
 * Tickets Scnext();hema
 */

function preValidatorSchema(thisObj, next) {
  if (!thisObj) {
    const validationError = new APIError("failed to save user data.");
    validationError.name = "mongoFieldError";
    next(validationError);
  } else {
    //preRequired
    //preValidator
  }
}

const TicketsSchema = new mongoose.Schema(
  {
    ...defaultSchemaValues,
    ...TicketsSchemaJson,
  },
  { usePushEach: true }
);

TicketsSchema.pre("validate", function (next) {
  preValidatorSchema(this, next);

  next();
});

/**
 * Statics
 */
TicketsSchema.statics = {
  /**
   * save and update tickets
   * @param tickets
   * @returns {Promise<Tickets, APIError>}
   */
  saveData(tickets) {
    return tickets.save().then((tickets) => {
      if (tickets) {
        return tickets;
      }
      const err = new APIError("Error in tickets", httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },

  /**
   * Get tickets
   * @param {ObjectId} id - The objectId of tickets.
   * @returns {Promise<Tickets, APIError>}
   */
  get(id) {
    return this.findById(id)
     .populate("emailId")
      .exec()
      .then((tickets) => {
        if (tickets) {
          return tickets;
        }
        const err = new APIError(
          "No such tickets exists!",
          httpStatus.NOT_FOUND
        );
        return Promise.reject(err);
      });
  },

  /**
   * List tickets in descending order of 'createdAt' timestamp.
   * @returns {Promise<Tickets[]>}
   */
  list(query) {
    return this.find(query.filter, query.dbfields)
      .populate("emailId")
      .sort(query.sorting)
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .exec();
  },
  /**
   * Count of tickets records
   * @returns {Promise<Tickets[]>}
   */
  totalCount(query) {
    return this.find(query.filter).countDocuments();
  },
};

/**
 * @typedef Tickets
 */
export default mongoose.model("Tickets", TicketsSchema);
