import axios from 'axios';

const token = document.querySelector('[name=csrf-token]');
if (token) { // bug in test
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
}

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

export const getRequest = (url, onSuccess, onFailure) => {
  axios.get(url, { headers })
    .then(response => {
      onSuccess(response.data);
    })
    .catch(error => {
      onFailure(errorContent(error));
    })
}

export const createRequest = (url, params, onSuccess, onFailure) => {
  axios.post(url, params, { headers })
  .then(response => {
    onSuccess(response);
  })
  .catch(error => {
    onFailure(errorContent(error));
  })
}

export const updateRequest = (url, params, onSuccess, onFailure) => {
  axios.put(url, params, { headers })
  .then(response => {
    onSuccess(response);
  })
  .catch(error => {
    onFailure(errorContent(error));
  })
}

export const deleteRequest = (url, onSuccess, onFailure) => {
  axios.delete(url, { headers })
  .then(response => {
    onSuccess(response);
  })
  .catch(error => {
    onFailure(errorContent(error));
  })
}

export const redirectOnSuccess = (response) => {
  window.location.href = response.headers.location;
}

const errorContent = (error) => {
  return error.response || error.message;
}
