/* eslint-disable jsx-a11y/anchor-is-valid */
import {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link, useNavigate} from 'react-router-dom'
import {useFormik} from 'formik'
import {getUserByToken, login} from '../core/_requests'
import {isCustomError, toAbsoluteUrl} from '../../../../_metronic/helpers'
import {useAuth} from '../core/Auth'
import {useIntl} from 'react-intl'

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('فرمت ایمیل اشتباه است')
    .min(3, 'حداقل باید سه کارکتر باشد')
    .max(50, 'حداکثر باید ۵۰ کارکتر باشد')
    .required('ایمیل اجباری است'),
  password: Yup.string()
    .min(3, 'حداقل باید سه کارکتر باشد')
    .max(50, 'حداکثر باید ۵۰ کارکتر باشد')
    .required('رمزعبور اجباری است'),
})

const initialValues = {
  email: 'mohsen.rezvani.rad33@gmail.com',
  password: 'Password123@',
}

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export function Login() {
  const intl = useIntl()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const {saveAuth, setCurrentUser} = useAuth()

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, {setStatus, setSubmitting, setFieldError}) => {
      setLoading(true)
      try {
        const {data: auth} = await login(values.email, values.password)
        saveAuth(auth.data)
        const {data: user} = await getUserByToken(auth.data.api_token)

        setCurrentUser(user.data)
        const emailVerifiedAt = user.data.emailVerifiedAt
        if (!emailVerifiedAt || isNaN(new Date(emailVerifiedAt).getTime())) {
          // Redirect to the email verification page if the condition is true
          navigate('/verify-email', {state: {emailSent: true}})
          return // Important to avoid running subsequent code
        }
      } catch (error) {
        console.error(error)
        saveAuth(undefined)
        setSubmitting(false)
        setLoading(false)

        // Check if the error is a custom error with a response field
        if (isCustomError(error)) {
          const errorMessage = error.response.data.message
          setStatus(errorMessage)

          // Check if the error contains form field validations
          const fieldErrors = error.response.data.errors
          if (fieldErrors) {
            // If there's a specific error message for 'email', set it
            if (fieldErrors.email && fieldErrors.email.length > 0) {
              setFieldError('email', fieldErrors.email.join(','))
            }
            if (fieldErrors.password && fieldErrors.password.length > 0) {
              setFieldError('password', fieldErrors.password.join(','))
            }
            // ... repeat for other fields if necessary ...
          }
        } else {
          setStatus('An unexpected error occurred.')
        }
      }
    },
  })

  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      {/* begin::Heading */}
      <div className='text-center mb-11'>
        <h1 className='text-dark fw-bolder mb-3'>
          {' '}
          {intl.formatMessage({id: 'AUTH.LOGIN.BUTTON'})}
        </h1>
      </div>
      {/* begin::Heading */}

      {formik.status && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      )}

      {/* begin::Form group */}
      <div className='fv-row mb-8'>
        <label className='form-label fs-6 fw-bolder text-dark'>
          {' '}
          {intl.formatMessage({id: 'AUTH.INPUT.EMAIL'})}
        </label>
        <input
          placeholder='Email'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control bg-transparent',
            {'is-invalid': formik.touched.email && formik.errors.email},
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
          type='email'
          name='email'
          autoComplete='off'
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.email}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-3'>
        <label className='form-label fw-bolder text-dark fs-6 mb-0'>
          {' '}
          {intl.formatMessage({id: 'AUTH.INPUT.PASSWORD'})}
        </label>
        <input
          type='password'
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
      {/* end::Form group */}

      {/* begin::Wrapper */}
      <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
        <div />

        {/* begin::Link */}
        <Link to='/auth/forgot-password' className='link-primary'>
          {intl.formatMessage({id: 'AUTH.GENERAL.FORGOT_BUTTON'})} ؟
        </Link>
        {/* end::Link */}
      </div>
      {/* end::Wrapper */}

      {/* begin::Action */}
      <div className='d-grid mb-10'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-primary'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && (
            <span className='indicator-label'>
              {' '}
              {intl.formatMessage({id: 'AUTH.CONTINUE.BUTTON'})}
            </span>
          )}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              {intl.formatMessage({id: 'AUTH.BOTTUN.LOADING'})}
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Action */}

      <div className='text-gray-500 text-center fw-semibold fs-6'>
        {intl.formatMessage({id: 'AUTH.GENERAL.NO_ACCOUNT'})}{' '}
        <Link to='/auth/registration' className='link-primary'>
          {intl.formatMessage({id: 'AUTH.REGISTER.TITLE'})}
        </Link>
      </div>
    </form>
  )
}
