import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty} from '../../../../../../_metronic/helpers'
import {initialUser, User} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {createUser, getAllUsers, updateUser} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {useIntl} from 'react-intl'
import {UserModel} from '../../../../auth'

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
    description: user.description || initialUser.description,
    title: user.title || initialUser.title,
  })

  const [userList, setUserList] = useState<UserModel[]>([])

  useEffect(() => {
    getAllUsers()
      .then((res) => setUserList(res.data))
      .catch()
  }, [])

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
          await createUser(values)
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
              {intl.formatMessage({id: 'AUTH.INPUT.TITLE'})}
            </label>

            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.TITLE'})}
              {...formik.getFieldProps('title')}
              type='text'
              name='title'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.title && formik.errors.title},
                {
                  'is-valid': formik.touched.title && !formik.errors.title,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.title && formik.errors.title && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.title}</span>
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
              {...formik.getFieldProps('description')}
              name='description'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.description && formik.errors.description},
                {
                  'is-valid': formik.touched.description && !formik.errors.description,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.description && formik.errors.description && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.description}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {intl.formatMessage({id: 'AUTH.INPUT.USERS'})}
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <select
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.USERS'})}
              {...formik.getFieldProps('user')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.user && formik.errors.user},
                {
                  'is-valid': formik.touched.user && !formik.errors.user,
                }
              )}
              name='user'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            >
              <option value=''> {intl.formatMessage({id: 'AUTH.INPUT.USERS'})}</option>
              {userList.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option> // assuming 'id' and 'name' fields exist
              ))}
            </select>
            {/* end::Input */}
            {formik.touched.user && formik.errors.user && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.user}</span>
              </div>
            )}
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
