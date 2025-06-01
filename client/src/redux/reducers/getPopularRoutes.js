import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import endpoints from "../../utils/endpoints";
import statusCodes from "../../utils/statusCodes";
export const fetchPopularRoutes = createAsyncThunk(
  "popularRoutes/fetch",
  async () => {
    console.log("endpoints are ", endpoints);
    const response = await axios.get(endpoints.getPopularRoutesEndpoint);
    console.log(response.data);
    return response.data;
  }
);

const initialState = {
  popularRoutesData: [],
  popularRoutesFetchStatus: statusCodes.idle,
};

const popularRouteSlice = createSlice({
  name: "popularRoutes",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchPopularRoutes.pending, (state) => {
        state.popularRoutesFetchStatus = statusCodes.loading;
      })
      .addCase(fetchPopularRoutes.fulfilled, (state, action) => {
        state.popularRoutesData = action.payload;
        state.popularRoutesFetchStatus = statusCodes.success;
      })
      .addCase(fetchPopularRoutes.rejected, (state, action) => {
        state.popularRoutesData = action.error;
        state.popularRoutesFetchStatus = statusCodes.error;
      });
  },
});

export default popularRouteSlice.reducer;
