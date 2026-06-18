export const getJwtToken = () => {
  return localStorage.getItem("jwtToken");
};

export const setJwtToken = (jwtToken) => {
  localStorage.setItem("jwtToken", jwtToken);
};

export const removeJwtToken = () => {
  localStorage.removeItem("jwtToken");
};
