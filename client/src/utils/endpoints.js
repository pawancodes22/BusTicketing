const baseUrl = "/api";

const endpoints = {
  getStationsEndpoint: `${baseUrl}/station/stationData`,
  getPopularRoutesEndpoint: `${baseUrl}/routes/popularRoutes`,
  getBusesByRouteAndDateEndpoint: `${baseUrl}/buses/getBusesByRouteAndDate`,
  getSeatsByBusIdEndpoint: `${baseUrl}/seats/seat-availability`,
  registerDataEndpoint: `${baseUrl}/auth/register`,
  loginUserEndpoint: `${baseUrl}/auth/login`,
  bookingDetailsEndpoint: `${baseUrl}/booking/bookSeats`,
  getTicketsEndpoint: `${baseUrl}/booking/getBookedTickets`,
  deleteSeatLocksEndpoint: `${baseUrl}/seatLocks/deleteSeatLocks`,
  paymentProcessEndpoint: `${baseUrl}/v1/process/payments`,
  getRazorpayKeyEndpoint: `${baseUrl}/v1/getKey`,
  paymentVerificationEndpoint: `${baseUrl}/v1/paymentVerification`,
};

export default endpoints;
