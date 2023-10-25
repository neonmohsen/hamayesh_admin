import {Navigate, useLocation} from 'react-router-dom'
import {VerifyEmail} from './EmailVerify'

// Define the shape of the location state
interface LocationState {
  emailSent?: boolean
}

const VerifyEmailWrapper = () => {
  const location = useLocation()
  const locationState = location.state as LocationState // Asserting the type of `state`.

  // If the emailSent state wasn't passed, we assume the user shouldn't be here.
  if (!locationState?.emailSent) {
    // The '/dashboard' will only be pushed to history if emailSent isn't true,
    // preventing the VerifyEmail component from loading.
    return <Navigate to='/dashboard' replace />
  }

  // If emailSent is true, we load the VerifyEmail component.
  return <VerifyEmail />
}

export default VerifyEmailWrapper
