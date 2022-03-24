import axios from 'axios';
import jwtDecoder from 'jwt-decode';

const BASE_URL = 'http://localhost:8000';

const api = {
  login: `${BASE_URL}/user/auth/login`,
  register: `${BASE_URL}/user/auth/register`,
  logout: `${BASE_URL}/user/auth/logout`,
  listings: `${BASE_URL}/listings`,
  createListing: `${BASE_URL}/listings/new`,
  publishListing: `${BASE_URL}/listings/publish`,
  unpublishListing: `${BASE_URL}/listings/unpublish`,
  bookings: `${BASE_URL}/bookings`,
  newBooking: `${BASE_URL}/bookings/new`,
  acceptBooking: `${BASE_URL}/bookings/accept`,
  declineBooking: `${BASE_URL}/bookings/decline`,
};

const apiCall = (method, url, body, login = false) => {
  return axios({
    method: method,
    url: url,
    data: body || null,
    headers: login || {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const login = async (body) => {
  try {
    // needed for backend OAuth
    const formData = new FormData();
    formData.append('username', body.username);
    formData.append('password', body.password);

    const response = await apiCall('POST', api.login, formData, {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('email', jwtDecoder(response.data.access_token).email);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const register = async (body) => {
  try {
    const response = await apiCall('POST', api.register, body);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('email', jwtDecoder(response.data.token).email);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const logout = async () => {
  try {
    const response = await apiCall('POST', api.logout);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getListings = async () => {
  try {
    const response = await apiCall('GET', api.listings);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getListing = async (id) => {
  try {
    const response = await apiCall('GET', `${api.listings}/${id}`);
    return response;
  } catch (error) {
    console.log(error.response.data);
    return error.response;
  }
};

export const deleteListing = async (id) => {
  try {
    const response = await apiCall('DELETE', `${api.listings}/${id}`);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const updateListing = async (id, body) => {
  try {
    const response = await apiCall('PUT', `${api.listings}/${id}`, body);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const createListing = async (body) => {
  try {
    const response = await apiCall('POST', api.createListing, body);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const publishListing = async (id, body) => {
  try {
    const response = await apiCall('PUT', `${api.publishListing}/${id}`, body);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const unpublishListing = async (id) => {
  try {
    const response = await apiCall('PUT', `${api.unpublishListing}/${id}`);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getBookings = async () => {
  try {
    const response = await apiCall('GET', api.bookings);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const newReview = async (listingId, bookingId, body) => {
  try {
    const response = await apiCall('PUT', `${api.listings}/${listingId}/review/${bookingId}`, body);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const newBooking = async (id, body) => {
  try {
    const response = await apiCall('POST', `${api.newBooking}/${id}`, body);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const acceptBooking = async (id) => {
  try {
    const response = await apiCall('PUT', `${api.acceptBooking}/${id}`);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const declineBooking = async (id) => {
  try {
    const response = await apiCall('PUT', `${api.declineBooking}/${id}`);
    return response;
  } catch (error) {
    return error.response;
  }
};
