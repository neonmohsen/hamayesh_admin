import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {FieldArray, FormikProvider, useFormik} from 'formik'
import {isNotEmpty, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {User} from '../core/_models'
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
    // email: Yup.string()
    //   .email('Wrong email format')
    //   .min(3, 'Minimum 3 symbols')
    //   .max(50, 'Maximum 50 symbols')
    //   .required('Email is required'),
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
      const response = await profileImage(file, 'logo')

      if (response.data.status === 'success') {
        const imagePath = response.data.data.logo[0].path
        formik.setFieldValue('logo', imagePath)
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
      formik.setFieldError('logo', errorMessage)

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
    formik.setFieldValue('details.address.state', stateValue) // update formik state
    formik.setFieldValue('details.address.city', '')
    // Fetch the cities based on the selected state
    const citiesData = await fetchCities(stateValue) // here, stateValue should be the stateId you wish to use for the lookup
    if (citiesData) {
      setCities(citiesData)
    } else {
      // handle the scenario when fetching cities fails
      setCities([])
    }
  }

  const [userForEdit] = useState({
    ...user,
    details: user.details || {
      address: {
        state: '',
        city: '',
        address: '',
      },
      emails: [],
      phoneNumbers: [],
    },
  })

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const blankImg = toAbsoluteUrl('/media/svg/avatars/blank.svg')

  const getChangedValues = (initialValues, currentValues) => {
    let changes: any = {}
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
          await updateUser(values.id, {
            ...changedValues,
            details: {...values?.details, emails, phoneNumbers},
          })
        } else {
          await createUser({
            ...values,
            details: {...values?.details, emails, phoneNumbers},
          })
        }
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(true)
        cancel(true)
      }
    },
  })

  const userAvatarImg = toAbsoluteUrl(`${process.env.REACT_APP_BASE_URL}/${formik.values.logo}`)
  console.log(typeof formik.values.details) // check what it logs

  const [emails, setEmails] = useState<string[]>((user.details?.emails as string[]) || [''])

  const handleEmailChange = (event, index) => {
    const newItems = [...emails]
    newItems[index] = event.target.value
    setEmails(newItems)
  }

  const handleEmailDelete = (index) => {
    if (emails.length > 1) {
      const newItems = [...emails]
      newItems.splice(index, 1)
      setEmails(newItems)
    }
  }
  const handleEmailAdd = () => {
    setEmails([...emails, ''])
  }

  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(
    (user.details?.phoneNumbers as string[]) || ['']
  )

  const handlePhoneNumberChange = (event, index) => {
    const newItems = [...phoneNumbers]
    newItems[index] = event.target.value
    setPhoneNumbers(newItems)
  }

  const handlePhoneNumberDelete = (index) => {
    if (phoneNumbers.length > 1) {
      const newItems = [...phoneNumbers]
      newItems.splice(index, 1)
      setPhoneNumbers(newItems)
    }
  }
  const handlePhoneNumberAdd = () => {
    setPhoneNumbers([...phoneNumbers, ''])
  }
  return (
    <FormikProvider value={formik}>
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
            </div>
            {/* end::Image input */}
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
              {...formik.getFieldProps('name')}
              type='text'
              name='name'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.name && formik.errors.name},
                {
                  'is-valid': formik.touched.name && !formik.errors.name,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.name && formik.errors.name && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.name}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>

          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.LINK'})}
            </label>

            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.LINK'})}
              {...formik.getFieldProps('link')}
              type='text'
              name='link'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.link && formik.errors.link},
                {
                  'is-valid': formik.touched.link && !formik.errors.link,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.link && formik.errors.link && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.link}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>

          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.DESCRIPTION'})}
            </label>

            {/* end::Label */}

            {/* begin::Input */}
            <textarea
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.DESCRIPTION'})}
              {...formik.getFieldProps('details.description')}
              name='details.description'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {
                  'is-invalid':
                    formik.touched.details?.description && formik.errors.details?.description,
                },
                {
                  'is-valid':
                    formik.touched.details?.description && !formik.errors.details?.description,
                }
              )}
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.details?.description && formik.errors.details?.description && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.details?.description}</span>
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
              {intl.formatMessage({id: 'AUTH.INPUT.ADDRESS'})}
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.ADDRESS'})}
              {...formik.getFieldProps('details.address.address')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {
                  'is-invalid':
                    formik.touched.details?.address?.address &&
                    formik.errors.details?.address?.address,
                },
                {
                  'is-valid':
                    formik.touched.details?.address?.address &&
                    !formik.errors.details?.address?.address,
                }
              )}
              type='text'
              name='details.address.address'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {/* end::Input */}
            {formik.touched.details?.address?.address && formik.errors.details?.address?.address && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.details?.address?.address}</span>
              </div>
            )}
          </div>

          <div className='fv-row mb-7'>
            <label className='fw-bold fs-6 mb-2'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.EMAIL'})}
            </label>

            {emails.map((item, index) => (
              <div key={index} className='d-flex align-items-center mb-2'>
                <input
                  placeholder={intl.formatMessage({id: 'AUTH.INPUT.EMAIL'})}
                  value={item}
                  onChange={(e) => handleEmailChange(e, index)}
                  className='form-control form-control-solid me-2'
                />
                <button
                  type='button'
                  className='btn btn-light me-3'
                  onClick={() => handleEmailDelete(index)}
                >
                  حذف
                </button>
              </div>
            ))}

            <button className='btn btn-primary' type='button' onClick={handleEmailAdd}>
              افزودن
            </button>
          </div>

          <div className='fv-row mb-7'>
            <label className='fw-bold fs-6 mb-2'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.PHONENUMBER'})}
            </label>

            {phoneNumbers.map((item, index) => (
              <div key={index} className='d-flex align-items-center mb-2'>
                <input
                  placeholder={intl.formatMessage({id: 'AUTH.INPUT.PHONENUMBER'})}
                  value={item}
                  onChange={(e) => handlePhoneNumberChange(e, index)}
                  className='form-control form-control-solid me-2'
                />
                <button
                  type='button'
                  className='btn btn-light me-3'
                  onClick={() => handlePhoneNumberDelete(index)}
                >
                  حذف
                </button>
              </div>
            ))}

            <button className='btn btn-primary' type='button' onClick={handlePhoneNumberAdd}>
              افزودن
            </button>
          </div>

          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {intl.formatMessage({id: 'AUTH.INPUT.STATE'})}
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <select
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.STATE'})}
              {...formik.getFieldProps('details.address.state')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {
                  'is-invalid':
                    formik.touched.details?.address?.state && formik.errors.details?.address?.state,
                },
                {
                  'is-valid':
                    formik.touched.details?.address?.state &&
                    !formik.errors.details?.address?.state,
                }
              )}
              name='details.address.state'
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
            {formik.touched.details?.address?.state && formik.errors.details?.address?.state && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.details?.address?.state}</span>
              </div>
            )}
          </div>

          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {intl.formatMessage({id: 'AUTH.INPUT.CITY'})}
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <select
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.CITY'})}
              {...formik.getFieldProps('details.address.city')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {
                  'is-invalid':
                    formik.touched.details?.address?.city && formik.errors.details?.address?.city,
                },
                {
                  'is-valid':
                    formik.touched.details?.address?.city && !formik.errors.details?.address?.city,
                }
              )}
              name='details.address.city'
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
            {formik.touched.details?.address?.city && formik.errors.details?.address?.city && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.details?.address?.city}</span>
              </div>
            )}
          </div>
        </div>

        <div className='text-center pt-15'>
          <button
            type='reset'
            onClick={() => cancel()}
            className='btn btn-light me-3'
            data-kt-users-modal-action='cancel'
            disabled={formik.isSubmitting || isUserLoading}
          >
            {intl.formatMessage({id: 'AUTH.BOTTUN.CANCEL'})}
          </button>

          <button
            type='submit'
            className='btn btn-primary'
            data-kt-users-modal-action='submit'
            disabled={isUserLoading || formik.isSubmitting || !formik.isValid || !formik.touched}
          >
            <span className='indicator-label'>
              {' '}
              {intl.formatMessage({id: 'AUTH.BOTTUN.SUBMIT'})}
            </span>
            {(formik.isSubmitting || isUserLoading) && (
              <span className='indicator-progress'>
                {intl.formatMessage({id: 'AUTH.BOTTUN.LOADING'})}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
      </form>
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </FormikProvider>
  )
}

export {UserEditModalForm}
