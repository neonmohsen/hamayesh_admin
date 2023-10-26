import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

export const UPDATE_CURRENT_USER_URL = `${API_URL}/admin/users/update-current`

// Server should return AuthModel
export function updateUser(data) {
  return axios.put(UPDATE_CURRENT_USER_URL, {
    ...data,
  })
}
