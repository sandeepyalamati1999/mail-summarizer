import { fetchBaseQuery } from "@reduxjs/toolkit/query"


export const withoutAuth = fetchBaseQuery({
    baseUrl: 'http://localhost:8676/api/',
  })

export const withAuth = fetchBaseQuery({
    baseUrl: 'http://localhost:8676/api/',
    headers: {
      Authorization: ""
    },
  })