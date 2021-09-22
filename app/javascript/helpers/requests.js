import axios from 'axios';

const token = document.querySelector('[name=csrf-token]').content
axios.defaults.headers.common['X-CSRF-TOKEN'] = token

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
    console.log(error)
    onFailure(error.response.data);
  })
}

export const redirectOnSuccess = (response) => {
 window.location.href = response.headers.location
}

