import { createApi } from "@reduxjs/toolkit/query/react";
import endpoints from "../../config/endpoints";
import { withoutAuth } from "./base.api";
import { DEFAULT_FILTER } from "../../constants/constants";

export const mailApiSlice = createApi({
  reducerPath: "mails",
  baseQuery: withoutAuth,
  tagTypes: ["mails"],
  endpoints: builder => ({
    getMails: builder.query({
      query: (filter = DEFAULT_FILTER) => `${endpoints.MAILS.GETALL}?filter=${JSON.stringify(filter)}`,
      providesTags: ["mails"]
    }),
  }),
});

export const { useGetMailsQuery } = mailApiSlice;
