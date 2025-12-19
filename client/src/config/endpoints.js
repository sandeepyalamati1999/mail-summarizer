const endpoints = {
  AUTH: {
    LOGIN: "/auth/login",
    GOOGLE_LOGIN: "/auth/google/webhook"
  },
  MAILS: {
    GETALL: "/mails",
    GET: id => `/mails/${id}`
  }
}

export default endpoints;