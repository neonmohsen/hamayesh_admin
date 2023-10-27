/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {useState, useEffect} from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import {fetchCities, fetchStates, getUserByToken, profileImage, register} from '../core/_requests'
import {Link} from 'react-router-dom'
import {PasswordMeterComponent} from '../../../../_metronic/assets/ts/components'
import {useAuth} from '../core/Auth'
import {ILocation} from '../core/_models'
import {useIntl} from 'react-intl'
import {isCustomError} from '../../../../_metronic/helpers'

const initialValues = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  // changepassword: '',
  phoneNumber: '', // new field
  national_id: '', // new field
  gender: '', // new field
  study_field: '',
  institute: '',
  degree: '',
  state: '',
  city: '',
  job: '',
  profile: '',
  // acceptTerms: false,
}

export function Registration() {
  const intl = useIntl()

  const handleImageChange = async (event) => {
    const file = event.currentTarget.files[0]
    if (!file) return

    try {
      const response = await profileImage(file)

      if (response.data.status === 'success') {
        const imagePath = response.data.data.profile[0].path
        formik.setFieldValue('profile', imagePath)
      } else {
        // If the request was technically successful, but the application
        // returned an error (e.g., file not supported, file too large, etc.)
        throw new Error(response.data.message || 'Error uploading file.')
      }
    } catch (error: any) {
      // Here you handle any errors that occurred during the request
      console.error('Error during image upload:', error)

      const errorMessage = error.response ? error.response.data.message : error.message

      // Set formik field error for image field
      formik.setFieldError('profile', errorMessage)

      // If you have a general 'status' field for displaying global form messages, you can use this too
      formik.setStatus('Failed to upload image.')
    }
  }

  const registrationSchema = Yup.object().shape({
    firstname: Yup.string()
      .min(3, intl.formatMessage({id: 'errors.firstname.min'}))
      .max(50, intl.formatMessage({id: 'errors.firstname.max'}))
      .required(intl.formatMessage({id: 'errors.firstname.required'})),
    email: Yup.string()
      .email(intl.formatMessage({id: 'errors.email.format'}))
      .min(3, intl.formatMessage({id: 'errors.email.min'}))
      .max(50, intl.formatMessage({id: 'errors.email.max'}))
      .required(intl.formatMessage({id: 'errors.email.required'})),
    lastname: Yup.string()
      .min(3, intl.formatMessage({id: 'errors.lastname.min'}))
      .max(50, intl.formatMessage({id: 'errors.lastname.max'}))
      .required(intl.formatMessage({id: 'errors.lastname.required'})),
    password: Yup.string()
      .min(3, intl.formatMessage({id: 'errors.password.min'}))
      .max(50, intl.formatMessage({id: 'errors.password.max'}))
      .required(intl.formatMessage({id: 'errors.password.required'})),
    // changepassword: Yup.string()
    //   .min(3, 'Minimum 3 symbols')
    //   .max(50, 'Maximum 50 symbols')
    //   .required('Password confirmation is required')
    //   .oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
    study_field: Yup.string()
      .min(2, intl.formatMessage({id: 'errors.study_field.min'}))
      .max(50, intl.formatMessage({id: 'errors.study_field.max'}))
      .required('Required'),
    institute: Yup.string()
      .min(2, intl.formatMessage({id: 'errors.institute.min'}))
      .max(50, intl.formatMessage({id: 'errors.institute.max'}))
      .required(intl.formatMessage({id: 'errors.institute.required'})),
    degree: Yup.string().required(intl.formatMessage({id: 'errors.degree.required'})),
    phoneNumber: Yup.string().required(intl.formatMessage({id: 'errors.phoneNumber.required'})), // Add suitable validation
    national_id: Yup.string().required(intl.formatMessage({id: 'errors.national_id.required'})), // Add suitable validation
    gender: Yup.string().required(intl.formatMessage({id: 'errors.gender.required'})),
    state: Yup.string().required(intl.formatMessage({id: 'errors.state.required'})),
    city: Yup.string().required(intl.formatMessage({id: 'errors.city.required'})),
    job: Yup.string().required(intl.formatMessage({id: 'errors.job.required'})),

    // acceptTerms: Yup.bool().required('You must accept the terms and conditions'),
  })

  const [states, setStates] = useState<ILocation[]>([])
  const [cities, setCities] = useState<ILocation[]>([]) // for storing cities based on selected state

  const [loading, setLoading] = useState(false)
  const {saveAuth, setCurrentUser} = useAuth()
  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values, {setStatus, setSubmitting, setFieldError}) => {
      setLoading(true)
      try {
        const {data: auth} = await register(
          values.email,
          values.firstname,
          values.lastname,
          values.password,
          values.phoneNumber,
          values.national_id,
          values.gender,
          values.study_field,
          values.degree,
          values.institute,
          values.state,
          values.city,
          values.job,
          values.profile
        )
        saveAuth(auth.data)
        const {data: user} = await getUserByToken(auth.data.api_token)
        setCurrentUser(user.data)
      } catch (error) {
        console.error(error)
        saveAuth(undefined)
        setSubmitting(false)
        setLoading(false)

        if (isCustomError(error)) {
          const errorMessage = error.response.data.message
          setStatus(errorMessage)

          const fieldErrors = error.response.data.errors
          if (fieldErrors) {
            Object.keys(fieldErrors).forEach((field) => {
              setFieldError(field, fieldErrors[field].join(', '))
            })
          }
        } else {
          setStatus('The registration details are incorrect.')
        }
      }
    },
  })

  useEffect(() => {
    fetchStates().then((data) => setStates(data))
    // similarly for fetchCities if needed
  }, [])
  useEffect(() => {
    PasswordMeterComponent.bootstrap()
  }, [])

  const handleStateChange = async (event) => {
    const stateValue = event.target.value
    formik.setFieldValue('state', stateValue) // update formik state
    formik.setFieldValue('city', '')
    // Fetch the cities based on the selected state
    const citiesData = await fetchCities(stateValue) // here, stateValue should be the stateId you wish to use for the lookup
    if (citiesData) {
      setCities(citiesData)
    } else {
      // handle the scenario when fetching cities fails
      setCities([])
    }
  }

  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_signup_form'
      onSubmit={formik.handleSubmit}
    >
      {/* begin::Heading */}
      <div className='text-center mb-11'>
        {/* begin::Title */}
        <h1 className='text-dark fw-bolder mb-3'>
          {' '}
          {intl.formatMessage({id: 'AUTH.REGISTER.TITLE'})}
        </h1>
        {/* end::Title */}
      </div>
      {/* end::Heading */}

      {formik.status && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      )}

      {/* begin::Form group Firstname */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-dark fs-6'>
          {' '}
          {intl.formatMessage({id: 'AUTH.INPUT.FIRSTNAME'})}
        </label>
        <input
          placeholder={intl.formatMessage({id: 'AUTH.INPUT.FIRSTNAME'})}
          type='text'
          autoComplete='off'
          {...formik.getFieldProps('firstname')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.firstname && formik.errors.firstname,
            },
            {
              'is-valid': formik.touched.firstname && !formik.errors.firstname,
            }
          )}
        />
        {formik.touched.firstname && formik.errors.firstname && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.firstname}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}
      <div className='fv-row mb-8'>
        {/* begin::Form group Lastname */}
        <label className='form-label fw-bolder text-dark fs-6'>
          {' '}
          {intl.formatMessage({id: 'AUTH.INPUT.LASTNAME'})}
        </label>
        <input
          placeholder={intl.formatMessage({id: 'AUTH.INPUT.LASTNAME'})}
          type='text'
          autoComplete='off'
          {...formik.getFieldProps('lastname')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.lastname && formik.errors.lastname,
            },
            {
              'is-valid': formik.touched.lastname && !formik.errors.lastname,
            }
          )}
        />
        {formik.touched.lastname && formik.errors.lastname && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.lastname}</span>
            </div>
          </div>
        )}
        {/* end::Form group */}
      </div>

      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-dark fs-6'>
          {' '}
          {intl.formatMessage({id: 'AUTH.INPUT.PHONENUMBER'})}
        </label>
        <input
          placeholder={intl.formatMessage({id: 'AUTH.INPUT.PHONENUMBER'})}
          type='text'
          {...formik.getFieldProps('phoneNumber')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.phoneNumber && formik.errors.phoneNumber,
            },
            {
              'is-valid': formik.touched.phoneNumber && !formik.errors.phoneNumber,
            }
          )}
        />
        {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>{formik.errors.phoneNumber}</div>
          </div>
        ) : null}
      </div>

      {/* begin::Form group Email */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-dark fs-6'>
          {' '}
          {intl.formatMessage({id: 'AUTH.INPUT.EMAIL'})}
        </label>
        <input
          placeholder={intl.formatMessage({id: 'AUTH.INPUT.EMAIL'})}
          type='email'
          autoComplete='off'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control bg-transparent',
            {'is-invalid': formik.touched.email && formik.errors.email},
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.email}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* new form group for National ID */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-dark fs-6'>
          {' '}
          {intl.formatMessage({id: 'AUTH.INPUT.NATIONALID'})}
        </label>
        <input
          placeholder={intl.formatMessage({id: 'AUTH.INPUT.NATIONALID'})}
          type='text'
          {...formik.getFieldProps('national_id')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.national_id && formik.errors.national_id,
            },
            {
              'is-valid': formik.touched.national_id && !formik.errors.national_id,
            }
          )}
        />
        {formik.touched.national_id && formik.errors.national_id ? (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>{formik.errors.national_id}</div>
          </div>
        ) : null}
      </div>

      {/* new form group for Study field */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-dark fs-6'>
          {' '}
          {intl.formatMessage({id: 'AUTH.INPUT.STUDYFIELD'})}
        </label>
        <input
          placeholder={intl.formatMessage({id: 'AUTH.INPUT.STUDYFIELD'})}
          type='text'
          {...formik.getFieldProps('study_field')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.study_field && formik.errors.study_field,
            },
            {
              'is-valid': formik.touched.study_field && !formik.errors.study_field,
            }
          )}
        />
        {formik.touched.study_field && formik.errors.study_field ? (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>{formik.errors.study_field}</div>
          </div>
        ) : null}
      </div>

      {/* new form group for Study field */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-dark fs-6'>
          {' '}
          {intl.formatMessage({id: 'AUTH.INPUT.INSTITUTE'})}
        </label>
        <input
          placeholder={intl.formatMessage({id: 'AUTH.INPUT.INSTITUTE'})}
          type='text'
          {...formik.getFieldProps('institute')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.institute && formik.errors.institute,
            },
            {
              'is-valid': formik.touched.institute && !formik.errors.institute,
            }
          )}
        />
        {formik.touched.institute && formik.errors.institute ? (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>{formik.errors.institute}</div>
          </div>
        ) : null}
      </div>

      {/* new form group for Study field */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-dark fs-6'>
          {' '}
          {intl.formatMessage({id: 'AUTH.INPUT.JOB'})}
        </label>
        <input
          placeholder={intl.formatMessage({id: 'AUTH.INPUT.JOB'})}
          type='text'
          {...formik.getFieldProps('job')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.job && formik.errors.job,
            },
            {
              'is-valid': formik.touched.job && !formik.errors.job,
            }
          )}
        />
        {formik.touched.job && formik.errors.job ? (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>{formik.errors.job}</div>
          </div>
        ) : null}
      </div>

      {/* new form group for Gender */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-dark fs-6'>
          {' '}
          {intl.formatMessage({id: 'AUTH.INPUT.DEGREE'})}
        </label>
        <select
          {...formik.getFieldProps('degree')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.degree && formik.errors.degree,
            },
            {
              'is-valid': formik.touched.degree && !formik.errors.degree,
            }
          )}
        >
          <option value=''> {intl.formatMessage({id: 'AUTH.INPUT.DEGREE'})}</option>
          <option value='male'> {intl.formatMessage({id: 'AUTH.INPUT.MALE'})}</option>
          <option value='female'> {intl.formatMessage({id: 'AUTH.INPUT.FEMALE'})}</option>
          {/* other options if needed */}
        </select>
        {formik.touched.degree && formik.errors.degree ? (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>{formik.errors.degree}</div>
          </div>
        ) : null}
      </div>

      {/* new form group for Gender */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-dark fs-6'>
          {' '}
          {intl.formatMessage({id: 'AUTH.INPUT.GENDER'})}
        </label>
        <select
          {...formik.getFieldProps('gender')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.gender && formik.errors.gender,
            },
            {
              'is-valid': formik.touched.gender && !formik.errors.gender,
            }
          )}
        >
          <option value=''> {intl.formatMessage({id: 'AUTH.INPUT.GENDER'})}</option>
          <option value='male'> {intl.formatMessage({id: 'AUTH.INPUT.MALE'})}</option>
          <option value='female'> {intl.formatMessage({id: 'AUTH.INPUT.FEMALE'})}</option>
          {/* other options if needed */}
        </select>
        {formik.touched.gender && formik.errors.gender ? (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>{formik.errors.gender}</div>
          </div>
        ) : null}
      </div>

      {/* State dropdown */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-dark fs-6'>
          {intl.formatMessage({id: 'AUTH.INPUT.STATE'})}
        </label>
        <select
          {...formik.getFieldProps('state')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.state && formik.errors.state,
            },
            {
              'is-valid': formik.touched.state && !formik.errors.state,
            }
          )}
          onChange={(e) => {
            handleStateChange(e) // then load cities
          }}
        >
          <option value=''> {intl.formatMessage({id: 'AUTH.INPUT.STATE'})}</option>
          {states.map((state) => (
            <option key={state._id} value={state._id}>
              {state.state}
            </option> // assuming 'id' and 'name' fields exist
          ))}
        </select>
        {formik.touched.state && formik.errors.state ? (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>{formik.errors.state}</div>
          </div>
        ) : null}
      </div>

      {/* City dropdown */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-dark fs-6'>
          {' '}
          {intl.formatMessage({id: 'AUTH.INPUT.CITY'})}
        </label>
        <select
          {...formik.getFieldProps('city')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.city && formik.errors.city,
            },
            {
              'is-valid': formik.touched.city && !formik.errors.city,
            }
          )}
          disabled={!formik.values.state} // disable if no state is selected
        >
          <option value=''> {intl.formatMessage({id: 'AUTH.INPUT.CITY'})}</option>
          {cities.map((city) => (
            <option key={city._id} value={city._id}>
              {city.city}
            </option> // assuming 'id' and 'name' fields exist
          ))}
        </select>
        {formik.touched.city && formik.errors.city ? (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>{formik.errors.city}</div>
          </div>
        ) : null}
      </div>

      {/* begin::Form group Password */}
      <div className='fv-row mb-8' data-kt-password-meter='true'>
        <div className='mb-1'>
          <label className='form-label fw-bolder text-dark fs-6'>
            {' '}
            {intl.formatMessage({id: 'AUTH.INPUT.PASSWORD'})}
          </label>
          <div className='position-relative mb-3'>
            <input
              type='password'
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.PASSWORD'})}
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
          {/* begin::Meter */}
          <div
            className='d-flex align-items-center mb-3'
            data-kt-password-meter-control='highlight'
          >
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px'></div>
          </div>
          {/* end::Meter */}
        </div>
        <div className='text-muted'>{intl.formatMessage({id: 'AUTH.INPUT.HELPER'})}</div>
      </div>

      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-dark fs-6'>
          {intl.formatMessage({id: 'AUTH.INPUT.IMAGE'})}
        </label>
        <input
          type='file'
          accept='image/*'
          className='form-control bg-transparent'
          onChange={handleImageChange}
        />
        {/* Display path after image upload */}
      </div>
      {/* end::Form group */}

      {/* begin::Form group Confirm password */}
      {/* <div className='fv-row mb-5'>
        <label className='form-label fw-bolder text-dark fs-6'>Confirm Password</label>
        <input
          type='password'
          placeholder='Password confirmation'
          autoComplete='off'
          {...formik.getFieldProps('changepassword')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.changepassword && formik.errors.changepassword,
            },
            {
              'is-valid': formik.touched.changepassword && !formik.errors.changepassword,
            }
          )}
        />
        {formik.touched.changepassword && formik.errors.changepassword && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.changepassword}</span>
            </div>
          </div>
        )}
      </div> */}
      {/* end::Form group */}

      {/* begin::Form group */}
      {/* <div className='fv-row mb-8'>
        <label className='form-check form-check-inline' htmlFor='kt_login_toc_agree'>
          <input
            className='form-check-input'
            type='checkbox'
            id='kt_login_toc_agree'
            {...formik.getFieldProps('acceptTerms')}
          />
          <span>
            I Accept the{' '}
            <a
              href='https://keenthemes.com/metronic/?page=faq'
              target='_blank'
              className='ms-1 link-primary'
            >
              Terms
            </a>
            .
          </span>
        </label>
        {formik.touched.acceptTerms && formik.errors.acceptTerms && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.acceptTerms}</span>
            </div>
          </div>
        )}
      </div> */}
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='text-center'>
        <button
          type='submit'
          id='kt_sign_up_submit'
          className='btn btn-lg btn-primary w-100 mb-5'
          disabled={formik.isSubmitting || !formik.isValid /*|| !formik.values.acceptTerms*/}
        >
          {!loading && (
            <span className='indicator-label'>
              {' '}
              {intl.formatMessage({id: 'AUTH.BOTTUN.SUBMIT'})}
            </span>
          )}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              {intl.formatMessage({id: 'AUTH.BOTTUN.LOADING'})}

              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
        <Link to='/auth/login'>
          <button
            type='button'
            id='kt_login_signup_form_cancel_button'
            className='btn btn-lg btn-light-primary w-100 mb-5'
          >
            {intl.formatMessage({id: 'AUTH.BOTTUN.CANCEL'})}
          </button>
        </Link>
      </div>
      {/* end::Form group */}
    </form>
  )
}
