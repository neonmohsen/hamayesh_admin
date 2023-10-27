import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {useFormik} from 'formik'
import {sendVerifyCode, verifyEmail} from '../core/_requests'
import {useIntl} from 'react-intl'
import {useAuth} from '../core/Auth'

const initialValues = {
  token: '',
}

// Define the shape of the location state
interface LocationState {
  emailSent?: boolean
}

export function VerifyEmail() {
  const intl = useIntl()

  const navigate = useNavigate()
  const location = useLocation()

  const locationState = location.state as LocationState // Here, you're asserting what type `state` is expected to be.

  const ResetPasswordSchema = Yup.object().shape({
    token: Yup.string().required('Token is required'),
  })
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<string | undefined>(undefined)
  const [exTime, setExTime] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const {setCurrentUser} = useAuth()

  // This effect happens when the component is mounted
  useEffect(() => {
    // Load exTime from localStorage when the component mounts
    const storedExTime = localStorage.getItem('exTime')
    if (storedExTime) {
      setExTime(parseInt(storedExTime))
    }

    // This is the cleanup function that React will run when
    // the component is unmounted or before running the effect next time
    return () => {
      // Remove exTime from localStorage when the component is unmounted
      localStorage.removeItem('exTime')
    }
  }, []) // An empty dependency array means this useEffect runs once on mount and the cleanup runs on unmount.
  // This effect manages the countdown based on exTime.
  useEffect(() => {
    if (exTime) {
      // Calculate the time remaining until exTime
      const calculateTimeRemaining = () => {
        const currentTime = Date.now()
        const timeLeft = exTime - currentTime // time left in milliseconds
        return timeLeft
      }

      // Update the countdown every second
      const timer = setInterval(() => {
        const timeLeft = calculateTimeRemaining()
        setTimeRemaining(timeLeft)

        if (timeLeft <= 0) {
          // If the countdown is over, clear the interval and reset the exTime
          clearInterval(timer)
          setExTime(null)
        }
      }, 1000)

      // Clear the interval if the component is unmounted or if exTime changes
      return () => clearInterval(timer)
    }
  }, [exTime])

  const formik = useFormik({
    initialValues,
    validationSchema: ResetPasswordSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      setHasErrors(undefined)
      verifyEmail(values.token)
        .then((res) => {
          setCurrentUser(res.data.data)
          setHasErrors('')
          setLoading(false)
          navigate('/auth') // Or wherever you wish to redirect users to
        })
        .catch((error) => {
          setLoading(false)
          setSubmitting(false)
          const errorMessage = error.response.data.message
          setHasErrors(error.response.data.message)
          setStatus(errorMessage)
        })
    },
  })

  React.useEffect(() => {
    // If the emailSent state wasn't passed, we assume the user shouldn't be here
    if (!locationState?.emailSent) {
      navigate('/dashboard') // redirect them to the ForgotPassword page
    }
  }, [locationState, navigate]) // Empty dependency array means this effect runs once when the component mounts

  // This effect handles sending the verification code.
  useEffect(() => {
    // Check if exTime is stored in local storage and is still valid
    const storedExTime = localStorage.getItem('exTime')
    const currentTime = Date.now()

    if (storedExTime && parseInt(storedExTime) > currentTime) {
      // If a valid exTime is already stored, don't resend the code
      return
    }

    if (locationState?.emailSent && !exTime) {
      sendVerifyCode()
        .then((res) => {
          const exTime = res.data.data.exTime

          // Set the exTime from the response, initiating the countdown
          setExTime(exTime)
          localStorage.setItem('exTime', exTime.toString()) // Save new exTime
        })
        .catch((err) => {
          console.error('Error sending verification code:', err)
        })
    }
  }, [locationState, exTime]) // Dependency on exTime ensures this runs only when necessary

  const formatTime = (timeInMilliseconds) => {
    const totalSeconds = Math.round(timeInMilliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds - minutes * 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_password_reset_form'
      onSubmit={formik.handleSubmit}
    >
      <div className='text-center mb-10'>
        {/* begin::Title */}
        <h1 className='text-dark fw-bolder mb-3'>
          {' '}
          {intl.formatMessage({id: 'AUTH.VERIFYEMAIL.TITLE'})}
        </h1>
        {/* end::Title */}
      </div>

      {/* begin::Title */}

      {hasErrors && (
        <div className='mb-10 bg-light-info p-8 rounded'>
          <div className='text-info'>{hasErrors}</div>
        </div>
      )}
      {/* end::Title */}

      {/* begin::Form group */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>
          {' '}
          {intl.formatMessage({id: 'AUTH.INPUT.CODE'})}
        </label>
        <input
          type='text'
          placeholder=''
          autoComplete='off'
          {...formik.getFieldProps('token')}
          className={clsx(
            'form-control bg-transparent',
            {'is-invalid': formik.touched.token && formik.errors.token},
            {
              'is-valid': formik.touched.token && !formik.errors.token,
            }
          )}
        />
        {formik.touched.token && formik.errors.token && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.token}</span>
            </div>
          </div>
        )}

        {/* Countdown timer display */}
        {timeRemaining > 0 && (
          <div className='text-center my-5'>
            <span className='text-muted'> {intl.formatMessage({id: 'AUTH.INPUT.CODEHELPER'})}</span>
            <span className='fw-bold text-primary'>{formatTime(timeRemaining)}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
        <button type='submit' id='kt_password_reset_submit' className='btn btn-primary me-4'>
          <span className='indicator-label'> {intl.formatMessage({id: 'AUTH.BOTTUN.SUBMIT'})}</span>
          {loading && (
            <span className='indicator-progress'>
              {intl.formatMessage({id: 'AUTH.BOTTUN.LOADING'})}
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
        <Link to='/auth/login'>
          <button
            type='button'
            id='kt_login_password_reset_form_cancel_button'
            className='btn btn-light'
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {intl.formatMessage({id: 'AUTH.BOTTUN.CANCEL'})}
          </button>
        </Link>{' '}
      </div>
      {/* end::Form group */}
    </form>
  )
}
