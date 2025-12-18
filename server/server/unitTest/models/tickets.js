import fake from '../lib/fake';
import serviceUtill from '../../utils/service.util';

function Tickets(options = {}) {var email = options.email || fake.email();
var password = options.password || "User1234$";
var changePassword = options.changePassword || "user@123"
var entityType = options.entityType || "user";
var accessToken = options.accessToken || "";
var newPhone = options.newPhone || fake.phone({ formatted: false });
var newFirstName = options.firstName || fake.name();
var newLastName = options.lastName || fake.name();
var newEmail = options.email || fake.email();
var id = options.employeeId || "";

this.getId = function getId() {
  return id;
};

this.setId = function setId(newId) {
  id = newId;
}

this.getEntityType = function getEntityType() {
  return entityType;
};

this.getNewPhone = function getNewPhone() {
  return newPhone;
};

this.getAccessToken = function getAccessToken() {
  return accessToken;
};

this.getPassword = function getPassword() {
  return password;
};
this.getChangePassword = function getChangePassword() {
  return changePassword
};

this.setAccessToken = function setAccessToken(newAccessToken) {
  accessToken = newAccessToken;
};

var email = options.email || fake.name();
this.getEmail = function getEmail() {
  return email;
};

this.getEnmail = function getEnmail() {
  return serviceUtill.encodeString(email);
};
var name = options.name || fake.name();
this.getName = function getName() {
  return name;
};
var created = options.created || fake.date();
this.getCreated = function getCreated() {
  return created;
};
var updated = options.updated || fake.date();
this.getUpdated = function getUpdated() {
  return updated;
};
var ticketId = options.ticketId || fake.name();
this.getTicketId = function getTicketId() {
  return ticketId;
};
var subject = options.subject || fake.name();
this.getSubject = function getSubject() {
  return subject;
};
var description = options.description || fake.name();
this.getDescription = function getDescription() {
  return description;
};
var priority = options.priority || fake.name();
this.getPriority = function getPriority() {
  return priority;
};
var status = options.status || fake.name();
this.getStatus = function getStatus() {
  return status;
};
var category = options.category || fake.name();
this.getCategory = function getCategory() {
  return category;
};
var dateOfIssue = options.dateOfIssue || fake.date();
this.getDateOfIssue = function getDateOfIssue() {
  return dateOfIssue;
};
var dateOfSubmission = options.dateOfSubmission || fake.date();
this.getDateOfSubmission = function getDateOfSubmission() {
  return dateOfSubmission;
};
var resolutionDate = options.resolutionDate || fake.date();
this.getResolutionDate = function getResolutionDate() {
  return resolutionDate;
};

this.getfields = function getfields() { 
return {
name,
created,
updated,
ticketId,
subject,
description,
priority,
status,
category,
dateOfIssue,
dateOfSubmission,
resolutionDate,
}; }}

export default Tickets;