import { TQueryParam, TResponseRedux } from "../../../types";
import { baseApi } from "../../api/baseApi";

const facultyCourseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFacultyCourses: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/enrolled-course",
          method: "GET",
          params: params,
        };
      },
      transformResponse: (response: TResponseRedux<any>) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },
    }),

    addMark: builder.mutation({
      query: (data) => ({
        url: "/enrolled-course/update-enrolled-course-marks",
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});
export const { useGetAllFacultyCoursesQuery, useAddMarkMutation } =
  facultyCourseApi;
