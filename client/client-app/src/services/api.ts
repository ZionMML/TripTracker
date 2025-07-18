import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "./authService";
import type { CreateUserDto, User } from "../types/types";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5253/api",
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getItems: builder.query<{ id: number; name: string }[], void>({
      query: () => "items",
    }),
    getUsers: builder.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
    getUser: builder.query<User, string>({
      query: (username) => `users/${username}`,
    }),
    login: builder.mutation<
      { token: string },
      { username: string; password: string }
    >({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    createUser: builder.mutation<
      void,
      {
        username: string;
        password: string;
        knownAs: string;
        gender: string;
        dateOfBirth: string;
        city: string;
        country: string;
      }
    >({
      query: (newUser) => ({
        url: "users",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation<
      void,
      { username: string; body: CreateUserDto }
    >({
      query: ({ username, body }) => ({
        url: `users/${username}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (username) => ({
        url: `users/${username}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetItemsQuery,
  useLoginMutation,
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = api;
