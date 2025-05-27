import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import statusCodes from "../../utils/statusCodes";
import endpoints from "../../utils/endpoints";
import axios from "axios";

const initialState = {
  ticketsData: [],
  ticketsDataFetchStatus: statusCodes.idle,
};

export const fetchTickets = createAsyncThunk("tickets/fetch", async () => {
  const jwtToken = sessionStorage.getItem("jwtToken");
  const response = await axios.get(endpoints.getTicketsEndpoint, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });
  console.log(jwtToken, response);
  return response.data;
});

const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.ticketsDataFetchStatus = statusCodes.pending;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.ticketsData = action.payload;
        state.ticketsDataFetchStatus = statusCodes.success;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.ticketsData = action.error;
        state.ticketsDataFetchStatus = statusCodes.error;
      });
  },
});

export default ticketSlice.reducer;
