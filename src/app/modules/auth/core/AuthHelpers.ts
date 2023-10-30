import {toast} from 'react-toastify'
import {navigateTo} from '../../../../_metronic/helpers/History'
import {AuthModel} from './_models'

const AUTH_LOCAL_STORAGE_KEY = 'kt-auth-react-v'
const getAuth = (): AuthModel | undefined => {
  if (!localStorage) {
    return
  }

  const lsValue: string | null = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY)
  if (!lsValue) {
    return
  }

  try {
    const auth: AuthModel = JSON.parse(lsValue) as AuthModel
    if (auth) {
      // You can easily check auth_token expiration also
      return auth
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
  }
}

const setAuth = (auth: any) => {
  if (!localStorage) {
    return
  }

  try {
    const lsValue = JSON.stringify(auth)
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, lsValue)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error)
  }
}

const removeAuth = () => {
  if (!localStorage) {
    return
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error)
  }
}

export function setupAxios(axios: any) {
  axios.defaults.headers.Accept = 'application/json'
  axios.defaults.headers.common['Accept-Language'] = 'fa'
  axios.interceptors.request.use(
    (config: {headers: {Authorization: string}}) => {
      const auth = getAuth()
      if (auth && auth.api_token) {
        config.headers.Authorization = `Bearer ${auth.api_token}`
      }

      return config
    },
    (err: any) => Promise.reject(err)
  )

  // Response interceptor
  axios.interceptors.response.use(
    (response) => {
      const {config, status, data} = response
      const {method} = config

      // Check if the method is 'delete', 'post', or 'put' (commonly used for update operations)
      if (['delete', 'post', 'put', 'patch'].includes(method)) {
        // Show a toast based on the status code or method
        if (status === 200 || status === 201) {
          // For successful post or delete
          toast.success(data.message, {
            position: 'top-right',
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          }) // Customize your message here
        }
      }

      // Any status code that lies within the range of 2xx will cause this function to trigger
      // Do something with response data
      return response
    },
    (error) => {
      // Error response
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        const {status, data} = error.response

        // Handle specific status codes
        if (status === 429) {
          // Too Many Requests
          toast.error('Too many requests. Please slow down.')
        } else if (status === 415) {
          // Specific action for status code 415
          navigateTo('/verify-email', {emailSent: true})
        } else {
          // General error message
          const errorMessage = data?.message || 'An error occurred'
          toast.error(errorMessage)
        }
      } else {
        // If there's no response from the server or another issue, you might want to show a general error message
        toast.error('An error occurred. Please try again.')
      }

      // Important: Make sure to return the error, so the calling function knows it was an error.
      return Promise.reject(error)
    }
  )
}

export {getAuth, setAuth, removeAuth, AUTH_LOCAL_STORAGE_KEY}
