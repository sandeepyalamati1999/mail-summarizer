const config = {
  activityConfig: {
    settingsCreate: {
      context: 'SETTINGS',
      contextType: 'CREATE',
      desc: 'Settings created',
      key: '101'
    },
    settingsUpdate: {
      context: 'SETTINGS',
      contextType: 'UPDATE',
      desc: 'Settings updated',
      key: '102'
    },
    settingsDelete: {
      context: 'SETTINGS',
      contextType: 'DELETE',
      desc: 'Settings deleted',
      key: '103'
    },
    employeeCreate: {
      context: 'EMPLOYEE',
      contextType: 'CREATE',
      desc: 'Employee created',
      key: '151'
    },
    employeeUpdate: {
      context: 'EMPLOYEE',
      contextType: 'UPDATE',
      desc: 'Employee Updated',
      key: '152'
    },
    employeeDelete: {
      context: 'EMPLOYEE',
      contextType: 'DELETE',
      desc: 'Employee deleted',
      key: '153'
    },
    employeeLogoutSuccess: {
      context: 'EMPLOYEE',
      contextType: 'LOGOUT',
      desc: 'Employee logout',
      key: '202'
    },
    employeeLoginSuccess: {
      context: 'EMPLOYEE',
      contextType: 'LOGIN',
      desc: 'Employee login',
      key: '205'
    },
    employeeChangePassword: {
      context: 'EMPLOYEE',
      contextType: 'CHANGEPASSWORD',
      desc: 'EMPLOYEE CHANGEPASSWORD',
      key: '206'
    },
    employeeForgotPassword: {
      context: 'EMPLOYEE',
      contextType: 'FORGOTPASSWORD',
      desc: 'EMPLOYEE FORGOTPASSWORD',
      key: '207'
    },
    roleCreate: {
      context: 'ROLE',
      contextType: 'CREATE',
      desc: 'Role created',
      key: '301'
    },
    roleUpdate: {
      context: 'ROLE',
      contextType: 'UPDATE',
      desc: 'Role updated',
      key: '302'
    },
    roleDelete: {
      context: 'ROLE',
      contextType: 'DELETE',
      desc: 'Role deleted',
      key: '303'
    },
    templatesCreate: {
      context: 'TEMPLATE',
      contextType: 'CREATE',
      desc: 'Templates created',
      key: '401'
    },
    templatesUpdate: {
      context: 'TEMPLATE',
      contextType: 'UPDATE',
      desc: 'Templates Updated',
      key: '402'
    },
    templatesDelete: {
      context: 'TEMPLATE',
      contextType: 'DELETE',
      desc: 'Templates deleted',
      key: '403'
    },
    otpSent:{
      context:"OTP",
      contextType:"SENT",
      desc:"Send OTP",
      key:"1500"
  },
  otpVerificationSuccess:{
      context:"OTP",
      contextType:"VERIFICATION_SUCCESS",
      desc:"Otp Verified Successfully.",
      key:"1525"
  },
  otpVerficationFailed:{
      context:"OTP",
      contextType:"VERIFICATION FAILED",
      desc:"INVALID OTP",
      key:"1550",
  },
  otpExpires:{
      context:"OTP",
      contextType:"OTP EXPIRES",
      desc:"OTP EXPIRES",
      key:"1575"
  },
  failedToSentOtp:{
      context:"OTP",
      contextType:"FAILED TO SENT OTP",
      desc:"FAILED TO SENT OTP",
      key:"1600"
  },
  
employeeRegister : {
    context: 'EMPLOYEE',
    contextType: 'REGISTER',
    desc: 'Employee Registerd',
    key: '805'
}

,
employeeMultidelete : {
    context: 'EMPLOYEE',
    contextType: 'MULTIDELETE',
    desc: 'Employee Multideleted',
    key: '193'
}

,
employeeGet : {
    context: 'EMPLOYEE',
    contextType: 'GET',
    desc: 'Employee Getd',
    key: '472'
}

,
employeeList : {
    context: 'EMPLOYEE',
    contextType: 'LIST',
    desc: 'Employee Listd',
    key: '162'
}

,
employeeCreate : {
    context: 'EMPLOYEE',
    contextType: 'CREATE',
    desc: 'Employee Created',
    key: '736'
}

,
employeeUpdate : {
    context: 'EMPLOYEE',
    contextType: 'UPDATE',
    desc: 'Employee Updated',
    key: '159'
}

,
employeeDelete : {
    context: 'EMPLOYEE',
    contextType: 'REMOVE',
    desc: 'Employee Removed',
    key: '849'
}

,
employeeLoginSuccess : {
    context: 'EMPLOYEE',
    contextType: 'LOGINSUCCESS',
    desc: 'Employee LoginSuccessd',
    key: '316'
}

,
employeeChangePassword : {
    context: 'EMPLOYEE',
    contextType: 'CHANGEPASSWORD',
    desc: 'Employee ChangePasswordd',
    key: '809'
}

,
employeeForgotPassword : {
    context: 'EMPLOYEE',
    contextType: 'FORGOTPASSWORD',
    desc: 'Employee ForgotPasswordd',
    key: '247'
}

,
employeeLogoutSuccess : {
    context: 'EMPLOYEE',
    contextType: 'LOGOUTSUCCESS',
    desc: 'Employee LogoutSuccessd',
    key: '364'
}

,
employeeRegister : {
    context: 'EMPLOYEE',
    contextType: 'REGISTER',
    desc: 'Employee Registerd',
    key: '780'
}

,
ticketsMultidelete : {
    context: 'TICKETS',
    contextType: 'MULTIDELETE',
    desc: 'Tickets Multideleted',
    key: '223'
}

,
ticketsGet : {
    context: 'TICKETS',
    contextType: 'GET',
    desc: 'Tickets Getd',
    key: '490'
}

,
ticketsList : {
    context: 'TICKETS',
    contextType: 'LIST',
    desc: 'Tickets Listd',
    key: '265'
}

,
ticketsCreate : {
    context: 'TICKETS',
    contextType: 'CREATE',
    desc: 'Tickets Created',
    key: '761'
}

,
ticketsUpdate : {
    context: 'TICKETS',
    contextType: 'UPDATE',
    desc: 'Tickets Updated',
    key: '131'
}

,
ticketsDelete : {
    context: 'TICKETS',
    contextType: 'REMOVE',
    desc: 'Tickets Removed',
    key: '583'
}

,
usersMultidelete : {
    context: 'USERS',
    contextType: 'MULTIDELETE',
    desc: 'Users Multideleted',
    key: '792'
}

,
usersGet : {
    context: 'USERS',
    contextType: 'GET',
    desc: 'Users Getd',
    key: '125'
}

,
usersList : {
    context: 'USERS',
    contextType: 'LIST',
    desc: 'Users Listd',
    key: '671'
}

,
usersCreate : {
    context: 'USERS',
    contextType: 'CREATE',
    desc: 'Users Created',
    key: '369'
}

,
usersUpdate : {
    context: 'USERS',
    contextType: 'UPDATE',
    desc: 'Users Updated',
    key: '455'
}

,
usersDelete : {
    context: 'USERS',
    contextType: 'REMOVE',
    desc: 'Users Removed',
    key: '767'
}

,
  },
};

export default config;
