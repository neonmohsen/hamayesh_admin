import {FC, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty} from '../../../../../../_metronic/helpers'
import {initialUser, User} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {createUser, updateUser} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {useIntl} from 'react-intl'

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

  const [userForEdit] = useState<User>({
    ...user,
    status: user.status || initialUser.status,
  })

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
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

  const formik = useFormik({
    initialValues: userForEdit,
    validationSchema: editUserSchema,
    onSubmit: async (values, {setSubmitting, setFieldError}) => {
      setSubmitting(true)

      const changedValues = getChangedValues(formik.initialValues, values)

      try {
        if (isNotEmpty(values.id)) {
          await updateUser(values.id, changedValues)
        } else {
          // await createUser(values)
        }
        cancel(true)
      } catch (error: any) {
        const fieldErrors = error.response.data.errors
        if (fieldErrors) {
          Object.keys(fieldErrors).forEach((field) => {
            setFieldError(field, fieldErrors[field].join(', '))
          })
        }
      } finally {
        setSubmitting(true)
      }
    },
  })

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

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.COMMENT'})}
            </label>

            {/* end::Label */}

            {/* begin::Input */}
            <textarea
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.COMMENT'})}
              {...formik.getFieldProps('comment')}
              name='comment'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.comment && formik.errors.comment},
                {
                  'is-valid': formik.touched.comment && !formik.errors.comment,
                }
              )}
              autoComplete='off'
              disabled
            />
            {formik.touched.comment && formik.errors.comment && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.comment}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>

          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.LIKENUMBER'})}
            </label>

            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.LIKENUMBER'})}
              {...formik.getFieldProps('likeNumber')}
              name='likeNumber'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.likeNumber && formik.errors.likeNumber},
                {
                  'is-valid': formik.touched.likeNumber && !formik.errors.likeNumber,
                }
              )}
              autoComplete='off'
              disabled
            />
            {formik.touched.likeNumber && formik.errors.likeNumber && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.likeNumber}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>

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
              {...formik.getFieldProps('userFirstName')}
              name='userFirstName'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.userFirstName && formik.errors.userFirstName},
                {
                  'is-valid': formik.touched.userFirstName && !formik.errors.userFirstName,
                }
              )}
              autoComplete='off'
              disabled
            />
            {formik.touched.userFirstName && formik.errors.userFirstName && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.userFirstName}</span>
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
              {...formik.getFieldProps('userLastName')}
              name='userLastName'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.userLastName && formik.errors.userLastName},
                {
                  'is-valid': formik.touched.userLastName && !formik.errors.userLastName,
                }
              )}
              autoComplete='off'
              disabled
            />
            {formik.touched.userLastName && formik.errors.userLastName && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.userLastName}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>

          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.IP'})}
            </label>

            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.IP'})}
              {...formik.getFieldProps('userIp')}
              name='userIp'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.userIp && formik.errors.userIp},
                {
                  'is-valid': formik.touched.userIp && !formik.errors.userIp,
                }
              )}
              autoComplete='off'
              disabled
            />
            {formik.touched.userIp && formik.errors.userIp && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.userIp}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>

          <div className='form-check form-switch form-check-custom form-check-solid fv-row mb-7'>
            {/* begin::Label */}

            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.STATUS'})}
              {...formik.getFieldProps('status')}
              name='status'
              type='checkbox'
              className={clsx(
                'form-check-input mb-3 mb-lg-0',
                {'is-invalid': formik.touched.status && formik.errors.status},
                {
                  'is-valid': formik.touched.status && !formik.errors.status,
                }
              )}
              autoComplete='off'
              id='flexSwitchDefault'
              checked={!!formik.values.status}
            />
            {formik.touched.status && formik.errors.status && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.status}</span>
                </div>
              </div>
            )}
            <label htmlFor='flexSwitchDefault' className='form-check-label fw-bold fs-6 '>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.STATUS'})}
            </label>
            {/* end::Input */}
          </div>

          {/* end::Input group */}

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
        {/* end::Actions */}
      </form>
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  )
}

export {UserEditModalForm}
