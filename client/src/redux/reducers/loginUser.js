import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import endpoints from "../../utils/endpoints";
import statusCodes from "../../utils/statusCodes";

export const postLoginData = createAsyncThunk(
  "user/login",
  async (loginJSON) => {
    try {
      const response = await axios.post(endpoints.loginUserEndpoint, loginJSON);
      return response.data.jwtToken;
    } catch (e) {
      throw { message: e.response.data };
    }
  },
);

const initialState = {
  loginData: [],
  loginDataPostStatus: statusCodes.idle,
};

const loginSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetLoginSlice: () => ({ ...initialState }),
  },
  extraReducers: (builder) => {
    builder.addCase(postLoginData.pending, (state) => {
      state.loginDataPostStatus = statusCodes.loading;
    });
    builder.addCase(postLoginData.fulfilled, (state, action) => {
      state.loginData = action.payload;
      state.loginDataPostStatus = statusCodes.success;
      sessionStorage.setItem("jwtToken", action.payload);
    });
    builder.addCase(postLoginData.rejected, (state, action) => {
      state.loginData = action.error.message;
      state.loginDataPostStatus = statusCodes.error;
    });
  },
});

export const { resetLoginSlice } = loginSlice.actions;
export default loginSlice.reducer;
