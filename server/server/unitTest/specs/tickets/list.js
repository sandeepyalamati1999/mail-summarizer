import 'babel-polyfill';
import request from 'supertest-as-promised';
import chaiAsPromised from 'chai-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../../index';

import auth from '../../http-requests/lib/authorization';
import mochaAsync from '../../lib/mocha-async';

// load credentials
import credentials from '../../data/credentials.json';
import responseCodes from '../../data/response-codes.json';

import i18nUtil from '../../../utils/i18n.util';

// load payload module
import payload from '../../http-requests/lib/payloads/';
import Tickets from '../../models/tickets';
import Employee from '../../models/employee';
const authEmployee = new Employee(credentials.validEmployee);
const tickets = new Tickets();
const createpostBody = payload.getPostBody(tickets);

import ticketsModel from '../../../models/tickets.model';

import {getErrorResponseByKey,getErroResponseByErrorMessage} from '../../common.reponse'
import {generateMatchingString,generateMinLengthString,generateMaxLengthString,generateRandomNumberString,generateRandomAlphabets} from '../../string.generator'

// inject promise to mocha
chai.config.includeStack = true;
chai.use(chaiAsPromised);describe("## Check tickets creation", () => {
  beforeEach(
    mochaAsync(async () => {
      // login tickets and get access token
      await auth.getAccessToken(authEmployee);

      let totaltickets = await ticketsModel.find({ active: true });
      tickets.setId(totaltickets.length);
    })
  );

  it("## Should return the list of the tickets", (done) => {
    request(app)
      .get("/api/tickets")
      .set({ Authorization: `Bearer ${authEmployee.getAccessToken()}` })
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body).to.have.property("tickets");
        expect(res.body.tickets).to.be.an("array");
        expect(res.body.tickets).to.not.have.length(0);
        done();
      })
      .catch(done);
  });

  it("## CHECK TOTAL RECORDS INCASE IF EXPORTTOCSV", (done) => {
    request(app)
      .get("/api/tickets?type=exportToCsv")
      .set({ Authorization: `Bearer ${authEmployee.getAccessToken()}` })
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body).to.have.property("tickets");
        expect(res.body.tickets).to.be.an("array");
        expect(res.body.tickets).to.not.have.length(0);
        if (tickets.getId() > 200)
          expect(res.body.tickets.length).to.equal(200);
        else expect(res.body.tickets.length).to.equal(tickets.getId());
        done();
      })
      .catch(done);
  });
});
describe("## TEST WITHOUT PASSING TOKEN", () => {
  beforeEach(
    mochaAsync(async () => {
      // login tickets and get access token
      await auth.getAccessToken(authEmployee);
    })
  );

  it("WITHOUT TOKEN PASSED", (done) => {
    request(app)
      .get("/api/tickets")

      .expect(httpStatus.OK)
      .then((res, req = {}) => {
        req.i18nKey = "ticketsCreate";
        expect(res.body).to.deep.equal(
          getErrorResponseByKey("noPermissionErr")
        );
        done();
      })
      .catch(done);
  });
});
