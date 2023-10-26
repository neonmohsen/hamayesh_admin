import React, {useEffect, useState} from 'react'
import {toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {ILocation, useAuth} from '../../../../auth'
import {useIntl} from 'react-intl'
import {updateUser} from '../../../core/_requests'
import {fetchCities, fetchStates} from '../../../../auth/core/_requests'

// const profileDetailsSchema = Yup.object().shape({
//   fName: Yup.string().required('First name is required'),
//   lName: Yup.string().required('Last name is required'),
//   company: Yup.string().required('Company name is required'),
//   contactPhone: Yup.string().required('Contact phone is required'),
//   companySite: Yup.string().required('Company site is required'),
//   country: Yup.string().required('Country is required'),
//   language: Yup.string().required('Language is required'),
//   timeZone: Yup.string().required('Time zone is required'),
//   currency: Yup.string().required('Currency is required'),
// })

const ProfileDetails: React.FC = () => {
  const intl = useIntl()

  const updaetSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(3, intl.formatMessage({id: 'errors.firstname.min'}))
      .max(50, intl.formatMessage({id: 'errors.firstname.max'}))
      .optional(),
    email: Yup.string()
      .email(intl.formatMessage({id: 'errors.email.format'}))
      .min(3, intl.formatMessage({id: 'errors.email.min'}))
      .max(50, intl.formatMessage({id: 'errors.email.max'}))
      .optional(),
    lastName: Yup.string()
      .min(3, intl.formatMessage({id: 'errors.lastname.min'}))
      .max(50, intl.formatMessage({id: 'errors.lastname.max'}))
      .optional(),
    // password: Yup.string()
    //   .min(3, intl.formatMessage({id: 'errors.password.min'}))
    //   .max(50, intl.formatMessage({id: 'errors.password.max'}))
    //   .required(intl.formatMessage({id: 'errors.password.required'})),
    // changepassword: Yup.string()
    //   .min(3, 'Minimum 3 symbols')
    //   .max(50, 'Maximum 50 symbols')
    //   .required('Password confirmation is required')
    //   .oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
    study_field: Yup.string()
      .min(2, intl.formatMessage({id: 'errors.study_field.min'}))
      .max(50, intl.formatMessage({id: 'errors.study_field.max'}))
      .optional(),
    institute: Yup.string()
      .min(2, intl.formatMessage({id: 'errors.institute.min'}))
      .max(50, intl.formatMessage({id: 'errors.institute.max'}))
      .optional(),
    degree: Yup.string().optional(),
    phoneNumber: Yup.string().optional(), // Add suitable validation
    national_id: Yup.string().optional(), // Add suitable validation
    gender: Yup.string().optional(),
    state: Yup.string().optional(),
    city: Yup.string().optional(),
    job: Yup.string().optional(),

    // acceptTerms: Yup.bool().required('You must accept the terms and conditions'),
  })

  const {currentUser} = useAuth()
  const [states, setStates] = useState<ILocation[]>([])
  const [cities, setCities] = useState<ILocation[]>([]) // for storing cities based on selected state

  useEffect(() => {
    fetchStates().then((data) => setStates(data))
    // similarly for fetchCities if needed
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

  const initialValues = {
    firstName: '',
    lastName: '',
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

  const getChangedValues = (initialValues, currentValues) => {
    let changes = {}
    Object.keys(currentValues).forEach((key) => {
      // If the current form values are different from the initial ones, add them to the changes object.
      if (currentValues[key] !== initialValues[key]) {
        changes[key] = currentValues[key]
      }
    })
    return changes
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik({
    initialValues: currentUser || initialValues,
    validationSchema: updaetSchema,
    onSubmit: (values) => {
      setLoading(true)

      const changedValues = getChangedValues(formik.initialValues, values)

      updateUser(changedValues)
        .then((res) => {})
        .catch((error) => {})
      setLoading(false)
    },
  })

  return (
    <div className='card mb-5 mb-xl-10'>
      <div
        className='card-header border-0 cursor-pointer'
        role='button'
        data-bs-toggle='collapse'
        data-bs-target='#kt_account_profile_details'
        aria-expanded='true'
        aria-controls='kt_account_profile_details'
      >
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'> {intl.formatMessage({id: 'AUTH.INPUT.PROFILEDETAIL'})}</h3>
        </div>
      </div>

      <div id='kt_account_profile_details' className='collapse show'>
        <form onSubmit={formik.handleSubmit} noValidate className='form'>
          <div className='card-body border-top p-9'>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                {intl.formatMessage({id: 'AUTH.INPUT.IMAGE'})}
              </label>
              <div className='col-lg-8'>
                <div
                  className='image-input image-input-outline'
                  data-kt-image-input='true'
                  style={{
                    backgroundImage: `url(${toAbsoluteUrl(
                      currentUser?.profileImage || '/media/avatars/blank.png'
                    )})`,
                  }}
                >
                  <div
                    className='image-input-wrapper w-125px h-125px'
                    style={{
                      backgroundImage: `url(${toAbsoluteUrl(currentUser?.profileImage || '')})`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                {' '}
                {intl.formatMessage({id: 'AUTH.INPUT.FULLNAME'})}
              </label>

              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='First name'
                      {...formik.getFieldProps('firstName')}
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.firstName}</div>
                      </div>
                    )}
                  </div>

                  <div className='col-lg-6 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid'
                      placeholder='Last name'
                      {...formik.getFieldProps('lastName')}
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.lastName}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                {' '}
                {intl.formatMessage({id: 'AUTH.INPUT.JOB'})}
              </label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Company name'
                  {...formik.getFieldProps('job')}
                />
                {formik.touched.job && formik.errors.job && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.job}</div>
                  </div>
                )}
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                {' '}
                {intl.formatMessage({id: 'AUTH.INPUT.STUDYFIELD'})}
              </label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Company name'
                  {...formik.getFieldProps('study_field')}
                />
                {formik.touched.study_field && formik.errors.study_field && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.job}</div>
                  </div>
                )}
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                {' '}
                {intl.formatMessage({id: 'AUTH.INPUT.EMAIL'})}
              </label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Company name'
                  {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.email}</div>
                  </div>
                )}
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                <span className='required'>
                  {' '}
                  {intl.formatMessage({id: 'AUTH.INPUT.PHONENUMBER'})}
                </span>
              </label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='tel'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Phone number'
                  {...formik.getFieldProps('phoneNumber')}
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.phoneNumber}</div>
                  </div>
                )}
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                <span className='required'>
                  {' '}
                  {intl.formatMessage({id: 'AUTH.INPUT.NATIONALID'})}
                </span>
              </label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='tel'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Phone number'
                  {...formik.getFieldProps('national_id')}
                />
                {formik.touched.national_id && formik.errors.national_id && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.national_id}</div>
                  </div>
                )}
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                <span className='required'>
                  {' '}
                  {intl.formatMessage({id: 'AUTH.INPUT.INSTITUTE'})}
                </span>
              </label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Company website'
                  {...formik.getFieldProps('institute')}
                />
                {formik.touched.institute && formik.errors.institute && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.institute}</div>
                  </div>
                )}
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                <span className='required'> {intl.formatMessage({id: 'AUTH.INPUT.STATE'})}</span>
              </label>

              <div className='col-lg-8 fv-row'>
                <select
                  className='form-select form-select-solid form-select-lg fw-bold'
                  {...formik.getFieldProps('state')}
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
                {formik.touched.state && formik.errors.state && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.state}</div>
                  </div>
                )}
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                {' '}
                {intl.formatMessage({id: 'AUTH.INPUT.CITY'})}
              </label>
              <div className='col-lg-8 fv-row'>
                <select
                  className='form-select form-select-solid form-select-lg'
                  {...formik.getFieldProps('city')}
                >
                  <option value=''> {intl.formatMessage({id: 'AUTH.INPUT.CITY'})}</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>
                      {city.city}
                    </option> // assuming 'id' and 'name' fields exist
                  ))}
                </select>
                {formik.touched.city && formik.errors.city && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.city}</div>
                  </div>
                )}
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                {' '}
                {intl.formatMessage({id: 'AUTH.INPUT.GENDER'})}
              </label>

              <div className='col-lg-8 fv-row'>
                <select
                  className='form-select form-select-solid form-select-lg'
                  {...formik.getFieldProps('gender')}
                >
                  <option value=''> {intl.formatMessage({id: 'AUTH.INPUT.GENDER'})}</option>
                  <option value='male'> {intl.formatMessage({id: 'AUTH.INPUT.MALE'})}</option>
                  <option value='female'> {intl.formatMessage({id: 'AUTH.INPUT.FEMALE'})}</option>
                </select>
                {formik.touched.gender && formik.errors.gender && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.gender}</div>
                  </div>
                )}
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                {' '}
                {intl.formatMessage({id: 'AUTH.INPUT.DEGREE'})}
              </label>

              <div className='col-lg-8 fv-row'>
                <select
                  className='form-select form-select-solid form-select-lg'
                  {...formik.getFieldProps('degree')}
                >
                  <option value=''> {intl.formatMessage({id: 'AUTH.INPUT.DEGREE'})}</option>
                  <option value='male'> {intl.formatMessage({id: 'AUTH.INPUT.MALE'})}</option>
                  <option value='female'> {intl.formatMessage({id: 'AUTH.INPUT.FEMALE'})}</option>
                </select>
                {formik.touched.degree && formik.errors.degree && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.degree}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button type='submit' className='btn btn-primary' disabled={loading}>
              {!loading && intl.formatMessage({id: 'AUTH.BOTTUN.SUBMIT'})}{' '}
              {loading && (
                <span className='indicator-progress' style={{display: 'block'}}>
                  {intl.formatMessage({id: 'AUTH.BOTTUN.LOADING'})}{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export {ProfileDetails}
