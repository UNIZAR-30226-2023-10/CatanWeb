import axios from 'axios';

let http = axios.create({
  baseURL: "http://ec2-3-8-165-26.eu-west-2.compute.amazonaws.com:8080/api",
  headers: { "Content-type": "application/json" },
});
export {http}