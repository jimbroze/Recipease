import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001" }),
  endpoints: (builder) => ({
    getRecipes: builder.query({
      query: () => `/recipes`,
    }),
    getRecipe: builder.query({
      query: (recipeId) => `/recipes/${recipeId}`,
    }),
    createRecipe: builder.mutation({
      query: ({ recipe, userId }) => ({
        url: "/recipes",
        method: "POST",
        body: { ...recipe, userId },
      }),
    }),
    editRecipe: builder.mutation({
      query: ({ recipe, userId }) => ({
        url: `/recipes/${recipe.id}`,
        method: "PATCH",
        body: { ...recipe, userId },
      }),
    }),
    deleteRecipe: builder.mutation({
      query: (recipeId) => ({
        url: `/recipes/${recipeId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetRecipesQuery,
  useGetRecipeQuery,
  useCreateRecipeMutation,
  useEditRecipeMutation,
  useDeleteRecipeMutation,
} = apiSlice;
