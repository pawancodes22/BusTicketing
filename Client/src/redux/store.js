import { combineReducers, configureStore } from "@reduxjs/toolkit";
import getStationsReducer from "./reducers/getStationsData";
import getPopularRoutesReducer from "./reducers/getPopularRoutes";
import getBusesByRouteAndDateReducer from "./reducers/getBusesByRouteAndDate";
import getSeatsAvailabilityReducer from "./reducers/getSeatsAvailabilityByBusId";
import registerUserReducer from "./reducers/registerUser";
import loginUserReducer from "./reducers/loginUser";
import bookingReducer from "./reducers/bookSeatsByUserId";
import ticketsByUserIdReducer from "./reducers/getTicketsByUserId";

const rootReducer = combineReducers({
  getStationsReducer,
  getPopularRoutesReducer,
  getBusesByRouteAndDateReducer,
  getSeatsAvailabilityReducer,
  registerUserReducer,
  loginUserReducer,
  bookingReducer,
  tickets: ticketsByUserIdReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
