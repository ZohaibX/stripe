import axios from 'axios';
// import logger from '../Log/logService.ts';

//! This is axios file for REST API Services -- would be used for multer and other REST Services

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    // logger.log(error);
    console.log(error);

    alert('An unexpected error occurrred.');
  }

  return Promise.reject(error);
});

export function setJwtHeader(jwt) {
  // laazmi
  // we'll set this in loginUserServices where all the operations on jwt are working
  axios.defaults.headers.common['x-auth-jwttoken'] = jwt; // so we can change it easily in other projects
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwtHeader,
};
