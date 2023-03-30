import http from "axios";
import { Navigate } from "react-router-dom";

const login = (email, password) => {
  return http
    .post("/api/login", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        console.log(response.data)
        localStorage.setItem("user", JSON.stringify(response.data.accessToken));
        return <Navigate to="/main" />;
      } //else {
        //return response.json().then(err => { throw new Error(err.error.message) })
     //}
     console.log(response);
    }).catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data.message);
    });
};

const register = (username, email, password, confirm_password) => {
    return http
    .post("/api/register", {
      username,
      email,
      password,
      confirm_password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        console.log("respuesta recibida");
        console.log(response.data)
        localStorage.setItem("key", JSON.stringify(response.data.accessToken));
        }
      console.log(response.status);
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export {
  register,
  login,
  logout,
  getUser,
};