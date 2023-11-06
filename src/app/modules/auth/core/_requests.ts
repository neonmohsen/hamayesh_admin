import axios from 'axios'
import {AuthModel, ILocation, UserModel} from './_models'

const API_URL = process.env.REACT_APP_API_URL

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/auth/verify-token`
export const LOGIN_URL = `${API_URL}/auth/login`
export const LOGOUT_URL = `${API_URL}/auth/logout`

export const REGISTER_URL = `${API_URL}/auth/register`
export const REQUEST_PASSWORD_URL = `${API_URL}/auth/forget-password`
export const RESET_PASSWORD_URL = `${API_URL}/auth/reset-password`

export const UPLOAD_URL = `${API_URL}/upload`
export const EVENT_DETAILS = `${API_URL}/hamayesh-detail`

export const VERIFY_CODE = `${API_URL}/auth/email-verified-send`
export const VERIFY_EMAIL = `${API_URL}/auth/email-verified-check`

export const STATES_URL = `${API_URL}/states`
export const getCitiesUrl = (stateId) => `${API_URL}/states/${stateId}/cities`

// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.post(LOGIN_URL, {
    email,
    password,
  })
}

// Server should return AuthModel
export function register(
  email,
  firstname,
  lastname,
  password,
  phoneNumber,
  national_id,
  gender,
  study_field,
  degree,
  institute,
  state,
  city,
  job,
  profile
) {
  return axios.post(REGISTER_URL, {
    email,
    firstName: firstname,
    lastName: lastname,
    password,
    phoneNumber,
    national_id,
    gender,
    study_field,
    degree,
    institute,
    state,
    city,
    job,
    profileImage: profile,
  })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{result: boolean}>(REQUEST_PASSWORD_URL, {
    email,
  })
}

export function profileImage(profile: string, name: string = 'profile') {
  // Create a FormData object
  const formData = new FormData()

  // Append the file to the 'profile' field. The 'profile' field here is the name
  // expected by your server. If your server expects a different field name, replace 'profile'
  // with the correct field name.
  formData.append(name, profile)

  // Send the request
  return axios.post(UPLOAD_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // This content type is crucial for file uploads
    },
  })
}

export function restPassword(token: string, password: string, passwordConfirmation: string) {
  return axios.post<{result: boolean}>(RESET_PASSWORD_URL, {
    token,
    password,
    passwordConfirmation,
  })
}

export function updateEvent(data) {
  return axios.patch(EVENT_DETAILS, data)
}

export function getUserByToken(token: string) {
  return axios.post(GET_USER_BY_ACCESSTOKEN_URL, {
    api_token: token,
  })
}

export function getEventDetails() {
  return axios.get(EVENT_DETAILS)
}

export function sendVerifyCode() {
  return axios.post(VERIFY_CODE)
}

export function verifyEmail(token: string) {
  return axios.post(VERIFY_EMAIL, {
    token,
  })
}

export async function fetchStates() {
  try {
    const response = await axios.get(STATES_URL) // replace with your states API
    return response.data.data // consider error handling and loading states
  } catch (error) {
    console.error('Failed to fetch states', error)
  }
}

export async function fetchCities(stateId) {
  try {
    const url = getCitiesUrl(stateId) // generate the URL with the state ID
    const response = await axios.get(url)
    return response.data.data // this will be your cities array
  } catch (error) {
    console.error('Failed to fetch cities', error)
    // Consider what you want to return in case of an error (e.g., null or an empty array)
  }
}
