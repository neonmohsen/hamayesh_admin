import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {initialUser, User} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {createUser, updateUser} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {useIntl} from 'react-intl'
import {fetchCities, fetchStates, profileImage} from '../../../../auth/core/_requests'
import {ILocation} from '../../../../auth'

type Props = {
  isUserLoading: boolean
  user: User
}

const UserEditModalForm: FC<Props> = ({user, isUserLoading}) => {
  const intl = useIntl()
  const editUserSchema = Yup.object().shape({
    email: Yup.string()
      .email('Wrong email format')
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Email is required'),
    // password: Yup.string()
    //   .min(3, intl.formatMessage({id: 'errors.password.min'}))
    //   .max(50, intl.formatMessage({id: 'errors.password.max'}))
    //   .optional(),
    // passwordConfirmation: Yup.string()
    //   .min(3, 'Minimum 3 symbols')
    //   .max(50, 'Maximum 50 symbols')
    //   .optional()
    //   .oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
    // name: Yup.string()
    //   .min(3, 'Minimum 3 symbols')
    //   .max(50, 'Maximum 50 symbols')
    //   .required('Name is required'),
  })

  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()

  const handleImageChange = async (event) => {
    const file = event.currentTarget.files[0]
    if (!file) return

    try {
      const response = await profileImage(file)

      if (response.data.status === 'success') {
        const imagePath = response.data.data.profile[0].path
        formik.setFieldValue('profileImage', imagePath)
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

  const [userForEdit] = useState<User>({
    ...user,
    profileImage: user.profileImage || initialUser.profileImage,
    role: user.role || initialUser.role,
    firstName: user.firstName || initialUser.firstName,
    lastName: user.lastName || initialUser.lastName,
    email: user.email || initialUser.email,
  })

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const blankImg = toAbsoluteUrl('/media/svg/avatars/blank.svg')

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

  const formik = useFormik({
    initialValues: userForEdit,
    validationSchema: editUserSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)

      const changedValues = getChangedValues(formik.initialValues, values)

      try {
        if (isNotEmpty(values.id)) {
          await updateUser(values.id, changedValues)
        } else {
          await createUser(values)
        }
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(true)
        cancel(true)
      }
    },
  })

  const userAvatarImg = toAbsoluteUrl(
    `${process.env.REACT_APP_BASE_URL}/${formik.values.profileImage}`
  )

  return (
    <>
      <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit} noValidate>
        {/* begin::Scroll */}
        <div
          className='d-flex flex-column scroll-y me-n7 pe-7'
          id='kt_modal_add_user_scroll'
          data-kt-scroll='true'
          data-kt-scroll-activate='{default: false, lg: true}'
          data-kt-scroll-max-height='auto'
          data-kt-scroll-dependencies='#kt_modal_add_user_header'
          data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
          data-kt-scroll-offset='300px'
        >
          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='d-block fw-bold fs-6 mb-5'>
              {intl.formatMessage({id: 'AUTH.INPUT.IMAGE'})}
            </label>
            {/* end::Label */}

            {/* begin::Image input */}
            <div
              className='image-input image-input-outline'
              data-kt-image-input='true'
              style={{backgroundImage: `url('${blankImg}')`}}
            >
              {/* begin::Preview existing avatar */}
              <div
                className='image-input-wrapper w-125px h-125px'
                style={{backgroundImage: `url('${userAvatarImg}')`}}
              ></div>
              {/* end::Preview existing avatar */}

              {/* begin::Label */}
              {/* <label
              className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
              data-kt-image-input-action='change'
              data-bs-toggle='tooltip'
              title='Change avatar'
            >
              <i className='bi bi-pencil-fill fs-7'></i>

              <input type='file' name='avatar' accept='.png, .jpg, .jpeg' />
              <input type='hidden' name='avatar_remove' />
            </label> */}
              {/* end::Label */}

              {/* begin::Cancel */}
              {/* <span
              className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
              data-kt-image-input-action='cancel'
              data-bs-toggle='tooltip'
              title='Cancel avatar'
            >
              <i className='bi bi-x fs-2'></i>
            </span> */}
              {/* end::Cancel */}

              {/* begin::Remove */}
              {/* <span
              className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
              data-kt-image-input-action='remove'
              data-bs-toggle='tooltip'
              title='Remove avatar'
            >
              <i className='bi bi-x fs-2'></i>
            </span> */}
              {/* end::Remove */}
            </div>
            {/* end::Image input */}

            {/* begin::Hint */}
            {/* <div className='form-text'>Allowed file types: png, jpg, jpeg.</div> */}
            {/* end::Hint */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='fw-bold fs-6 mb-2'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.UPLOAD'})}
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              type='file'
              accept='image/*'
              className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
              onChange={handleImageChange}
            />
          </div>
          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.FIRSTNAME'})}
            </label>

            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.FIRSTNAME'})}
              {...formik.getFieldProps('firstName')}
              type='text'
              name='firstName'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.firstName && formik.errors.firstName},
                {
                  'is-valid': formik.touched.firstName && !formik.errors.firstName,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.firstName}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>

          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.LASTNAME'})}
            </label>

            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.LASTNAME'})}
              {...formik.getFieldProps('lastName')}
              type='text'
              name='lastName'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.lastName && formik.errors.lastName},
                {
                  'is-valid': formik.touched.lastName && !formik.errors.lastName,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.lastName}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>

          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.JOB'})}
            </label>

            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.JOB'})}
              {...formik.getFieldProps('job')}
              type='text'
              name='job'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.job && formik.errors.job},
                {
                  'is-valid': formik.touched.job && !formik.errors.job,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.job && formik.errors.job && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.job}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>

          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {intl.formatMessage({id: 'AUTH.INPUT.STUDYFIELD'})}
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.STUDYFIELD'})}
              {...formik.getFieldProps('study_field')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.study_field && formik.errors.study_field},
                {
                  'is-valid': formik.touched.study_field && !formik.errors.study_field,
                }
              )}
              type='text'
              name='study_field'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {/* end::Input */}
            {formik.touched.study_field && formik.errors.study_field && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.study_field}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {intl.formatMessage({id: 'AUTH.INPUT.INSTITUTE'})}
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.INSTITUTE'})}
              {...formik.getFieldProps('institute')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.institute && formik.errors.institute},
                {
                  'is-valid': formik.touched.institute && !formik.errors.institute,
                }
              )}
              type='text'
              name='institute'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {/* end::Input */}
            {formik.touched.institute && formik.errors.institute && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.institute}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {intl.formatMessage({id: 'AUTH.INPUT.GENDER'})}
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <select
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.GENDER'})}
              {...formik.getFieldProps('gender')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.gender && formik.errors.gender},
                {
                  'is-valid': formik.touched.gender && !formik.errors.gender,
                }
              )}
              name='gender'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            >
              <option value=''> {intl.formatMessage({id: 'AUTH.INPUT.GENDER'})}</option>
              <option value='male'> {intl.formatMessage({id: 'AUTH.INPUT.MALE'})}</option>
              <option value='female'> {intl.formatMessage({id: 'AUTH.INPUT.FEMALE'})}</option>
            </select>
            {/* end::Input */}
            {formik.touched.gender && formik.errors.gender && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.gender}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {intl.formatMessage({id: 'AUTH.INPUT.DEGREE'})}
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <select
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.DEGREE'})}
              {...formik.getFieldProps('degree')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.degree && formik.errors.degree},
                {
                  'is-valid': formik.touched.degree && !formik.errors.degree,
                }
              )}
              name='degree'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            >
              <option value='diploma'>دیپلم</option>
              <option value='associate-degree'>کارشناسی دوساله</option>
              <option value='bachelor-degree'>کارشناسی</option>
              <option value='master-degree'>کارشناسی ارشد</option>
              <option value='doctorate-degree'>دکترا</option>
            </select>

            {/* end::Input */}
            {formik.touched.degree && formik.errors.degree && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.degree}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {intl.formatMessage({id: 'AUTH.INPUT.EMAIL'})}
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.EMAIL'})}
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.email && formik.errors.email},
                {
                  'is-valid': formik.touched.email && !formik.errors.email,
                }
              )}
              type='email'
              name='email'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {/* end::Input */}
            {formik.touched.email && formik.errors.email && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.email}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {intl.formatMessage({id: 'AUTH.INPUT.PHONENUMBER'})}
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.PHONENUMBER'})}
              {...formik.getFieldProps('phoneNumber')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.phoneNumber && formik.errors.phoneNumber},
                {
                  'is-valid': formik.touched.phoneNumber && !formik.errors.phoneNumber,
                }
              )}
              type='text'
              name='phoneNumber'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {/* end::Input */}
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.phoneNumber}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {intl.formatMessage({id: 'AUTH.INPUT.NATIONALID'})}
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.NATIONALID'})}
              {...formik.getFieldProps('national_id')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.national_id && formik.errors.national_id},
                {
                  'is-valid': formik.touched.national_id && !formik.errors.national_id,
                }
              )}
              type='text'
              name='national_id'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {/* end::Input */}
            {formik.touched.national_id && formik.errors.national_id && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.national_id}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {intl.formatMessage({id: 'AUTH.INPUT.STATE'})}
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <select
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.STATE'})}
              {...formik.getFieldProps('state')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.state && formik.errors.state},
                {
                  'is-valid': formik.touched.state && !formik.errors.state,
                }
              )}
              name='state'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
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

            {/* end::Input */}
            {formik.touched.state && formik.errors.state && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.state}</span>
              </div>
            )}
          </div>

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {intl.formatMessage({id: 'AUTH.INPUT.CITY'})}
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <select
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.CITY'})}
              {...formik.getFieldProps('city')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.city && formik.errors.city},
                {
                  'is-valid': formik.touched.city && !formik.errors.city,
                }
              )}
              name='city'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            >
              <option value=''> {intl.formatMessage({id: 'AUTH.INPUT.CITY'})}</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.city}
                </option> // assuming 'id' and 'name' fields exist
              ))}
            </select>

            {/* end::Input */}
            {formik.touched.city && formik.errors.city && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.city}</span>
              </div>
            )}
          </div>

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {intl.formatMessage({id: 'AUTH.INPUT.PASSWORD'})}
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.PASSWORD'})}
              {...formik.getFieldProps('password')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.password && formik.errors.password},
                {
                  'is-valid': formik.touched.password && !formik.errors.password,
                }
              )}
              type='password'
              name='password'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {/* end::Input */}
            {formik.touched.password && formik.errors.password && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.password}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {intl.formatMessage({id: 'AUTH.INPUT.PASSWORD'})}
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.PASSWORD'})}
              {...formik.getFieldProps('passwordConfirmation')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {
                  'is-invalid':
                    formik.touched.passwordConfirmation && formik.errors.passwordConfirmation,
                },
                {
                  'is-valid':
                    formik.touched.passwordConfirmation && !formik.errors.passwordConfirmation,
                }
              )}
              type='passwordConfirmation'
              name='passwordConfirmation'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {/* end::Input */}
            {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.passwordConfirmation}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-5'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.ROLE'})}
            </label>
            {/* end::Label */}
            {/* begin::Roles */}
            {/* begin::Input row */}
            <div className='d-flex fv-row'>
              {/* begin::Radio */}
              <div className='form-check form-check-custom form-check-solid'>
                {/* begin::Input */}
                <input
                  className='form-check-input me-3'
                  {...formik.getFieldProps('role')}
                  name='role'
                  type='radio'
                  value='admin'
                  id='kt_modal_update_role_option_0'
                  checked={formik.values.role === 'admin'}
                  disabled={formik.isSubmitting || isUserLoading}
                />

                {/* end::Input */}

                {/* begin::Label */}
                <label className='form-check-label' htmlFor='kt_modal_update_role_option_0'>
                  <div className='fw-bolder text-gray-800'>
                    {intl.formatMessage({id: 'AUTH.INPUT.ADMIN'})}
                  </div>
                </label>
                {/* end::Label */}
              </div>
              {/* end::Radio */}
            </div>
            {/* end::Input row */}
            <div className='separator separator-dashed my-5'></div>
            {/* begin::Input row */}
            <div className='d-flex fv-row'>
              {/* begin::Radio */}
              <div className='form-check form-check-custom form-check-solid'>
                {/* begin::Input */}
                <input
                  className='form-check-input me-3'
                  {...formik.getFieldProps('role')}
                  name='role'
                  type='radio'
                  value='user'
                  id='kt_modal_update_role_option_1'
                  checked={formik.values.role === 'user'}
                  disabled={formik.isSubmitting || isUserLoading}
                />
                {/* end::Input */}
                {/* begin::Label */}
                <label className='form-check-label' htmlFor='kt_modal_update_role_option_1'>
                  <div className='fw-bolder text-gray-800'>
                    {' '}
                    {intl.formatMessage({id: 'AUTH.INPUT.USER'})}
                  </div>
                </label>
                {/* end::Label */}
              </div>
              {/* end::Radio */}
            </div>
            {/* end::Input row */}
            <div className='separator separator-dashed my-5'></div>
            {/* begin::Input row */}
            <div className='d-flex fv-row'>
              {/* begin::Radio */}
              <div className='form-check form-check-custom form-check-solid'>
                {/* begin::Input */}
                <input
                  className='form-check-input me-3'
                  {...formik.getFieldProps('role')}
                  name='role'
                  type='radio'
                  value='executive'
                  id='kt_modal_update_role_option_2'
                  checked={formik.values.role === 'executive'}
                  disabled={formik.isSubmitting || isUserLoading}
                />

                {/* end::Input */}
                {/* begin::Label */}
                <label className='form-check-label' htmlFor='kt_modal_update_role_option_2'>
                  <div className='fw-bolder text-gray-800'>
                    {' '}
                    {intl.formatMessage({id: 'AUTH.INPUT.EXECUTIVE'})}
                  </div>
                </label>
                {/* end::Label */}
              </div>
              {/* end::Radio */}
            </div>
            {/* end::Input row */}
            <div className='separator separator-dashed my-5'></div>
            {/* begin::Input row */}
            <div className='d-flex fv-row'>
              {/* begin::Radio */}
              <div className='form-check form-check-custom form-check-solid'>
                {/* begin::Input */}
                <input
                  className='form-check-input me-3'
                  {...formik.getFieldProps('role')}
                  name='role'
                  type='radio'
                  value='scientific'
                  id='kt_modal_update_role_option_3'
                  checked={formik.values.role === 'scientific'}
                  disabled={formik.isSubmitting || isUserLoading}
                />
                {/* end::Input */}
                {/* begin::Label */}
                <label className='form-check-label' htmlFor='kt_modal_update_role_option_3'>
                  <div className='fw-bolder text-gray-800'>
                    {' '}
                    {intl.formatMessage({id: 'AUTH.INPUT.SCIENTIFIC'})}
                  </div>
                </label>
                {/* end::Label */}
              </div>
              {/* end::Radio */}
            </div>
            {/* end::Input row */}
            <div className='separator separator-dashed my-5'></div>
            {/* begin::Input row */}
            <div className='d-flex fv-row'>
              {/* begin::Radio */}
              <div className='form-check form-check-custom form-check-solid'>
                {/* begin::Input */}
                <input
                  className='form-check-input me-3'
                  {...formik.getFieldProps('role')}
                  name='role'
                  type='radio'
                  id='kt_modal_update_role_option_4'
                  value='referee'
                  checked={formik.values.role === 'referee'}
                  disabled={formik.isSubmitting || isUserLoading}
                />
                {/* end::Input */}
                {/* begin::Label */}
                <label className='form-check-label' htmlFor='kt_modal_update_role_option_4'>
                  <div className='fw-bolder text-gray-800'>
                    {' '}
                    {intl.formatMessage({id: 'AUTH.INPUT.REFEREE'})}
                  </div>
                </label>
                {/* end::Label */}
              </div>
              {/* end::Radio */}
            </div>
            {/* end::Input row */}
            {/* end::Roles */}
          </div>
          {/* end::Input group */}
        </div>
        {/* end::Scroll */}

        {/* begin::Actions */}
        <div className='text-center pt-15'>
          <button
            type='reset'
            onClick={() => cancel()}
            className='btn btn-light me-3'
            data-kt-users-modal-action='cancel'
            disabled={formik.isSubmitting || isUserLoading}
          >
            Discard
          </button>

          <button
            type='submit'
            className='btn btn-primary'
            data-kt-users-modal-action='submit'
            disabled={isUserLoading || formik.isSubmitting || !formik.isValid || !formik.touched}
          >
            <span className='indicator-label'>Submit</span>
            {(formik.isSubmitting || isUserLoading) && (
              <span className='indicator-progress'>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
        {/* end::Actions */}
      </form>
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  )
}

export {UserEditModalForm}
