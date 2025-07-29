import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearToken, getRefreshToken, getToken, setToken } from "./authService";
import type { CreateUserDto, ProfilePhoto, User } from "../types/types";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

type RefreshResposne = {
  token: string;
  refreshToken: string;
};

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.log("Token expired, attempting to refresh...");

    const token = getToken();
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      console.log("No refresh token available");
      clearToken();
      return {
        error: {
          status: 401,
          statusText: "Unauthorized",
          data: { message: "Refresh token invalid" },
        },
      };
    }

    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
        body: { token, refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const { token: newToken, refreshToken: newRefreshToken } =
        refreshResult.data as RefreshResposne;

      setToken(newToken, newRefreshToken);

      // Retry original request with updated token
      //result = await baseQuery(args, api, extraOptions);
      let retryHeaders: Headers;

      if (typeof args === "string") {
        retryHeaders = new Headers();
      } else if (args.headers instanceof Headers) {
        retryHeaders = new Headers(args.headers); // clone Headers
      } else if (Array.isArray(args.headers)) {
        retryHeaders = new Headers(args.headers as [string, string][]);
      } else {
        // Safely convert Record<string, string | undefined> to Record<string, string>
        const safeHeaders = Object.fromEntries(
          Object.entries(args.headers ?? {}).filter(
            ([, v]) => typeof v === "string"
          )
        ) as Record<string, string>;

        retryHeaders = new Headers(safeHeaders);
      }

      retryHeaders.set("Authorization", `Bearer ${newToken}`);

      const updatedArgs: FetchArgs =
        typeof args === "string"
          ? { url: args, headers: retryHeaders }
          : { ...args, headers: retryHeaders };

      result = await baseQuery(updatedArgs, api, extraOptions);
    } else {
      console.log("Refresh failed", refreshResult.error);
      clearToken();
      return {
        error: {
          status: 401,
          statusText: "Unauthorized",
          data: { message: "Refresh token invalid" },
        },
      };
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getItems: builder.query<{ id: number; name: string }[], void>({
      query: () => "items",
    }),
    getUsers: builder.query<User[], void>({
      query: () => "Users",
      providesTags: ["Users"],
    }),
    getUser: builder.query<User, string>({
      query: (username) => `users/${username}`,
      providesTags: (_result, _error, username) => [
        { type: "Users", id: username },
      ],
    }),
    login: builder.mutation<
      { token: string; refreshToken: string },
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
      invalidatesTags: (_result, _error, { username }) => [
        {
          type: "Users",
          id: username,
        },
      ],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (username) => ({
        url: `users/${username}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    addPhoto: builder.mutation<
      ProfilePhoto,
      { username: string; file: File; isProfilePhoto: boolean }
    >({
      query: ({ username, file, isProfilePhoto }) => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("file", file);
        formData.append("isProfilePhoto", String(isProfilePhoto));

        return {
          url: "users/add-photo",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Users"],
    }),
    deletePhoto: builder.mutation<void, { photoId: number; username: string }>({
      query: ({ photoId, username }) => ({
        url: `users/delete-photo?photoId=${photoId}&username=${username}`,
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
  useAddPhotoMutation,
  useDeletePhotoMutation,
} = api;
