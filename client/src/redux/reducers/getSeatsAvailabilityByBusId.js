import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import statusCodes from "../../utils/statusCodes";
import axios from "axios";
import endpoints from "../../utils/endpoints";

const initialState = {
  seatsStatus: [],
  seatsAvailabilityFetchStatus: statusCodes.loading,
};

export const fetchSeatsAvailability = createAsyncThunk(
  "seatsAvailability/get",
  async (fetchSeatsJSON) => {
    try {
      const jwtToken = sessionStorage.getItem("jwtToken");
      const response = await axios.get(
        `${endpoints.getSeatsByBusIdEndpoint}/${fetchSeatsJSON.busId}?travelDate=${fetchSeatsJSON.travelDate}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      return error.response?.message || "Error while fetching seats";
    }
  },
);

const getSeatsAvailabilitySlice = createSlice({
  name: "seatsAvailability",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeatsAvailability.pending, (state) => {
        state.seatsAvailabilityFetchStatus = statusCodes.loading;
      })
      .addCase(fetchSeatsAvailability.fulfilled, (state, action) => {
        state.seatsAvailabilityFetchStatus = statusCodes.success;
        state.seatsStatus = action.payload;
      })
      .addCase(fetchSeatsAvailability.rejected, (state, action) => {
        state.seatsAvailabilityFetchStatus = statusCodes.error;
        state.seatsStatus = action.error;
      });
  },
});

export default getSeatsAvailabilitySlice.reducer;
