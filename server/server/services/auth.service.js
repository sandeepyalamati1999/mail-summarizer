import User from '../models/user.model';
import Employee from '../models/employee.model';


export default {
  auth: ["User", "Employee"],
  getAuthModel: (type) => {
    return
  },
  User, Employee
}