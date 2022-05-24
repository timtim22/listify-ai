import axios from 'axios';

const token = document.querySelector('[name=csrf-token]');
if (token) { // bug in test
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
}

export const getRequest = (url, onSuccess, onFailure) => {
  axios.get(url)
    .then(response => {
      onSuccess(response.data);
    })
    .catch(error => {
      onFailure(error.response.data);
    })
}

export const createRequest = (url, params, onSuccess, onFailure) => {
  axios.post(url, params)
  .then(response => {
    onSuccess(response);
  })
  .catch(error => {
    onFailure(error.response.data);
  })
}

export const updateRequest = (url, params, onSuccess, onFailure) => {
  return axios.put(url, params)
    .then(response => {
      onSuccess(response);
    })
    .catch(error => {
      onFailure(error.response.data);
    })
}

export const redirectOnSuccess = (response) => {
 window.location.href = response.headers.location
}

