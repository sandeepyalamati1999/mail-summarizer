function EmployeePayload() {
  return {
    getLoginEmployee(employee) {
      return {
        email: employee.getEmail(),
        password: employee.getPassword(),
        entityType: employee.getEntityType(),
      };
    },

    getPostEmployee(employee) {
      let { name, email, address, phone, created, updated } =
        employee.getfields();
      return {
        name,
        email,
        address,
        phone,
        created,
        updated,
      };
    },
  };
}

export default EmployeePayload;
