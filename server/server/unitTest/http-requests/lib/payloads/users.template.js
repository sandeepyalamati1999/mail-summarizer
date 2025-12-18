function UsersPayload() {
  return {
    getPostUsers(users) {
      let {
        userName,
        created,
        updated,
        email,
        password,
        phoneNo,
        department,
        location,
      } = users.getfields();
      return {
        userName,
        created,
        updated,
        email,
        password,
        phoneNo,
        department,
        location,
      };
    },
  };
}

export default UsersPayload;
