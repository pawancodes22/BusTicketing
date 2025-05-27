import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import endpoints from "../../utils/endpoints";
import axios from "axios";
import statusCodes from "../../utils/statusCodes";

export const fetchBusesByRouteAndDate = createAsyncThunk(
  "buses/fetchBuses",
  async (journeyDetailsJSON) => {
    console.log("jjson", journeyDetailsJSON);
    const response = await axios.get(
      `${endpoints.getBusesByRouteAndDateEndpoint}?departureStation=${journeyDetailsJSON.departureStation}&arrivalStation=${journeyDetailsJSON.arrivalStation}&travelDate=${journeyDetailsJSON.travelDate}&busType=${journeyDetailsJSON.busTypeFilter}`
    );
    console.log("fetching bus by route", response.data);
    return response.data;
  }
);

const initialState = {
  busesByRouteAndDateData: [],
  busesByRouteAndDateFetchStatus: statusCodes.idle,
};

const busesByRouteAndDateSlice = createSlice({
  name: "busesByRouteAndDate",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusesByRouteAndDate.pending, (state) => {
        state.busesByRouteAndDateFetchStatus = statusCodes.loading;
      })
      .addCase(fetchBusesByRouteAndDate.fulfilled, (state, action) => {
        state.busesByRouteAndDateData = action.payload;
        state.busesByRouteAndDateFetchStatus = statusCodes.success;
      })
      .addCase(fetchBusesByRouteAndDate.rejected, (state, action) => {
        state.busesByRouteAndDateData = action.error;
        state.busesByRouteAndDateFetchStatus = statusCodes.error;
      });
  },
});

export default busesByRouteAndDateSlice.reducer;
