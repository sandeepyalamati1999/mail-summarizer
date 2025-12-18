import fake from '../lib/fake';
import serviceUtill from '../../utils/service.util';

function Users(options = {}) {var email = options.email || fake.email();
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
var userName = options.userName || fake.name();
this.getUserName = function getUserName() {
  return userName;
};
var created = options.created || fake.date();
this.getCreated = function getCreated() {
  return created;
};
var updated = options.updated || fake.date();
this.getUpdated = function getUpdated() {
  return updated;
};
var email = options.email || fake.name();
this.getEmail = function getEmail() {
  return email;
};
var password = options.password || fake.name();
this.getPassword = function getPassword() {
  return password;
};
var phoneNo = options.phoneNo || fake.name();
this.getPhoneNo = function getPhoneNo() {
  return phoneNo;
};
var department = options.department || fake.name();
this.getDepartment = function getDepartment() {
  return department;
};
var location = options.location || fake.name();
this.getLocation = function getLocation() {
  return location;
};

this.getfields = function getfields() { 
return {
userName,
created,
updated,
email,
password,
phoneNo,
department,
location,
}; }}

export default Users;