import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import statusCodes from "../../utils/statusCodes";
import endpoints from "../../utils/endpoints";
import axios from "axios";

const initialState = {
  stationData: [],
  getStationDataStatus: statusCodes.idle,
};

export const fetchStations = createAsyncThunk(
  "stations/fetchStations",
  async () => {
    const response = await axios.get(endpoints.getStationsEndpoint);
    return response.data;
  }
);

const getStationsReducer = createSlice({
  name: "stations",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchStations.pending, (state) => {
        state.getStationDataStatus = statusCodes.pending;
      })
      .addCase(fetchStations.fulfilled, (state, action) => {
        state.stationData = action.payload;
        state.getStationDataStatus = statusCodes.success;
      })
      .addCase(fetchStations.rejected, (state, action) => {
        state.stationData = action.error;
        state.getStationDataStatus = statusCodes.error;
      });
  },
});

export default getStationsReducer.reducer;
