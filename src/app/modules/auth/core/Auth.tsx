import {
  FC,
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react'
import {LayoutSplashScreen} from '../../../../_metronic/layout/core'
import {UserModel} from './_models'
import * as authHelper from './AuthHelpers'
import {getUserByToken, LOGOUT_URL} from './_requests'
import {WithChildren} from '../../../../_metronic/helpers'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
type AuthContextProps = {
  auth: any
  saveAuth: (auth: any) => void
  currentUser: UserModel | undefined
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>
  logout: () => void
}

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => {},
  currentUser: undefined,
  setCurrentUser: () => {},
  logout: () => {},
}

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)

const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider: FC<WithChildren> = ({children}) => {
  const [auth, setAuth] = useState<any>(authHelper.getAuth())
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>()

  const saveAuth = (auth: any) => {
    setAuth(auth)
    if (auth) {
      authHelper.setAuth(auth)
    } else {
      authHelper.removeAuth()
    }
  }

  const logout = async () => {
    try {
      // Request to server for logging out, this URL is your server's API endpoint for logout
      await axios.post(LOGOUT_URL, null, {
        // If needed, you can add headers here, for instance, if your server requires an auth token
        // headers: { 'Authorization': `Bearer ${auth?.data.api_token}` },
      })
    } catch (error) {
      saveAuth(undefined)
      setCurrentUser(undefined)
      // Handle logout error, e.g., by logging or displaying a message to the user
    }

    saveAuth(undefined)
    setCurrentUser(undefined)
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        saveAuth,
        currentUser,
        setCurrentUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const AuthInit: FC<WithChildren> = ({children}) => {
  const {auth, logout, setCurrentUser} = useAuth()
  const didRequest = useRef(false)
  const [showSplashScreen, setShowSplashScreen] = useState(true)

  const navigate = useNavigate()
  // We should request user by authToken (IN OUR EXAMPLE IT'S API_TOKEN) before rendering the application
  useEffect(() => {
    const requestUser = async (apiToken: string) => {
      try {
        if (!didRequest.current) {
          const {data} = await getUserByToken(apiToken)
          if (data) {
            setCurrentUser(data.data)

            // Check if 'emailVerifiedAt' is null or not a valid date
            const emailVerifiedAt = data.data.emailVerifiedAt
            if (!emailVerifiedAt || isNaN(new Date(emailVerifiedAt).getTime())) {
              // Redirect to the email verification page if the condition is true
              navigate('/verify-email', {state: {emailSent: true}})
              return // Important to avoid running subsequent code
            }
          }
        }
      } catch (error) {
        console.error(error)
        if (!didRequest.current) {
          logout()
        }
      } finally {
        setShowSplashScreen(false)
      }

      return () => (didRequest.current = true)
    }

    if (auth && auth.api_token) {
      requestUser(auth.api_token)
    } else {
      setShowSplashScreen(false)
    }
    // eslint-disable-next-line
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
}

export {AuthProvider, AuthInit, useAuth}
