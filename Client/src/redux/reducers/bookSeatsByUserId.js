import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import endpoints from "../../utils/endpoints";
import statusCodes from "../../utils/statusCodes";

export const bookSeats = createAsyncThunk(
  "seats/book",
  async (bookingDetailsJSON) => {
    try {
      const jwtToken = sessionStorage.getItem("jwtToken");
      console.log("inside reducer", bookingDetailsJSON);
      const response = await axios.post(
        endpoints.bookingDetailsEndpoint,
        bookingDetailsJSON,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return response.data;
    } catch (e) {
      throw { message: e.response.data };
    }
  }
);

const initialState = {
  bookingData: [],
  bookingDataStatus: statusCodes.idle,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    resetBookingState: (state) => {
      state.bookingData = [];
      state.bookingDataStatus = statusCodes.idle;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(bookSeats.pending, (state) => {
      state.bookingDataStatus = statusCodes.loading;
    });
    builder.addCase(bookSeats.fulfilled, (state, action) => {
      state.bookingData = action.payload;
      state.bookingDataStatus = statusCodes.success;
    });
    builder.addCase(bookSeats.rejected, (state, action) => {
      state.bookingData = action.error.message;
      state.bookingDataStatus = statusCodes.error;
    });
  },
});

export const { resetBookingState } = bookingSlice.actions;

export default bookingSlice.reducer;
