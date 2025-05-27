import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import statusCodes from "../../utils/statusCodes";
import axios from "axios";
import endpoints from "../../utils/endpoints";

const initialState = {
  registerData: "",
  registerDataFetchStatus: statusCodes.idle,
};

export const postUserData = createAsyncThunk(
  "user/post",
  async (userDetails) => {
    console.log("form details", userDetails);
    try {
      const response = await axios.post(
        endpoints.registerDataEndpoint,
        userDetails
      );

      console.log(response.data);
      return response.data;
    } catch (e) {
      console.log(e.response.data);
      throw { message: e.response.data };
    }
  }
);

const registerSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(postUserData.pending, (state) => {
      state.registerDataFetchStatus = statusCodes.loading;
    });
    builder.addCase(postUserData.fulfilled, (state, action) => {
      state.registerDataFetchStatus = statusCodes.success;
      state.registerData = action.payload;
    });
    builder.addCase(postUserData.rejected, (state, action) => {
      state.registerDataFetchStatus = statusCodes.error;
      state.registerData = action.error.message;
    });
  },
});

export default registerSlice.reducer;
