import { createApi } from "@reduxjs/toolkit/query/react";
import endpoints from "../../config/endpoints";
import { withoutAuth } from "./base.api";

export const authApiSlice = createApi({
  reducerPath: "auth",
  baseQuery: withoutAuth,
  tagTypes: ["auth"],
  endpoints: builder => ({
    googleLogin: builder.mutation({
      query: (body) => ({
        url: endpoints.AUTH.GOOGLE_LOGIN,
        method: "POST",
        body
      }),
    }),
  }),
});

export const { useGoogleLoginMutation } = authApiSlice;
