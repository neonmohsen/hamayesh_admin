import React, {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {useFormik} from 'formik'
import {restPassword} from '../core/_requests'
import {useIntl} from 'react-intl'

const initialValues = {
  token: '',
  password: '',
  passwordConfirmation: '',
}

// Define the shape of the location state
interface LocationState {
  emailSent?: boolean
}

export function ResetPassword() {
  const intl = useIntl()

  const navigate = useNavigate()
  const location = useLocation()

  const locationState = location.state as LocationState // Here, you're asserting what type `state` is expected to be.

  const ResetPasswordSchema = Yup.object().shape({
    token: Yup.string().required('Token is required'),
    password: Yup.string()
      .min(3, intl.formatMessage({id: 'errors.password.min'}))
      .max(50, intl.formatMessage({id: 'errors.password.max'}))
      .required(intl.formatMessage({id: 'errors.password.required'})),
    passwordConfirmation: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Password confirmation is required')
      .oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
  })
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const formik = useFormik({
    initialValues,
    validationSchema: ResetPasswordSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      setHasErrors(undefined)
      restPassword(values.token, values.password, values.passwordConfirmation)
        .then(({data: {result}}) => {
          setHasErrors(false)
          setLoading(false)
          navigate('/auth') // Or wherever you wish to redirect users to
        })
        .catch((error) => {
          setHasErrors(true)
          setLoading(false)
          setSubmitting(false)
          const errorMessage = error.response.data.message
          setStatus(errorMessage)
        })
    },
  })

  React.useEffect(() => {
    // If the emailSent state wasn't passed, we assume the user shouldn't be here
    if (!locationState?.emailSent) {
      navigate('/auth/forgot-password') // redirect them to the ForgotPassword page
    }
  }, [locationState, navigate]) // Empty dependency array means this effect runs once when the component mounts

  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_password_reset_form'
      onSubmit={formik.handleSubmit}
    >
      <div className='text-center mb-10'>
        {/* begin::Title */}
        <h1 className='text-dark fw-bolder mb-3'>Forgot Password ?</h1>
        {/* end::Title */}

        {/* begin::Link */}
        <div className='text-gray-500 fw-semibold fs-6'>
          Enter your email to reset your password.
        </div>
        {/* end::Link */}
      </div>

      {/* begin::Title */}
      {hasErrors === true && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>
            Sorry, looks like there are some errors detected, please try again.
          </div>
        </div>
      )}

      {hasErrors === false && (
        <div className='mb-10 bg-light-info p-8 rounded'>
          <div className='text-info'>Sent password reset. Please check your email</div>
        </div>
      )}
      {/* end::Title */}

      {/* begin::Form group */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>Code</label>
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
      </div>
      {/* end::Form group */}
      {/* begin::Form group Confirm password */}
      <div className='fv-row mb-5'>
        <label className='form-label fw-bolder text-dark fs-6'>Password</label>
        <input
          type='password'
          placeholder='Password'
          autoComplete='off'
          {...formik.getFieldProps('password')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.password && formik.errors.password,
            },
            {
              'is-valid': formik.touched.password && !formik.errors.password,
            }
          )}
        />
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>

      {/* begin::Form group Confirm password */}
      <div className='fv-row mb-5'>
        <label className='form-label fw-bolder text-dark fs-6'>Confirm Password</label>
        <input
          type='password'
          placeholder='Password confirmation'
          autoComplete='off'
          {...formik.getFieldProps('passwordConfirmation')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid':
                formik.touched.passwordConfirmation && formik.errors.passwordConfirmation,
            },
            {
              'is-valid':
                formik.touched.passwordConfirmation && !formik.errors.passwordConfirmation,
            }
          )}
        />
        {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.passwordConfirmation}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
        <button type='submit' id='kt_password_reset_submit' className='btn btn-primary me-4'>
          <span className='indicator-label'>Submit</span>
          {loading && (
            <span className='indicator-progress'>
              Please wait...
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
            Cancel
          </button>
        </Link>{' '}
      </div>
      {/* end::Form group */}
    </form>
  )
}
