import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty} from '../../../../../../_metronic/helpers'
import {User} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {createUser, getAllCategories, updateUser} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {useIntl} from 'react-intl'
import Select from 'react-select'
import {useAuth} from '../../../../auth'

import {CKEditor} from '@ckeditor/ckeditor5-react'
import ClassicEditor from '../../../../../../build/ckeditor'

type Props = {
  isUserLoading: boolean
  user: User
}
type SelectOption = {
  value: string
  label: string
}
const UserEditModalForm: FC<Props> = ({user, isUserLoading}) => {
  console.log(user)
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

  const [categoryList, setCategoryList] = useState<any>([])
  const [selectedCategory, setSelectedCategory] = useState<SelectOption | null>(null)

  useEffect(() => {
    if (user?.category) {
      setSelectedCategory({
        value: user.category?.id,
        label: `${user.category.title}`,
      })
    }
  }, [user])
  const {currentUser} = useAuth()

  // useEffect(() => {
  //   if (categoryList?.length) {
  //     const selected = user?.referees
  //       ?.map((userId) => {
  //         const userDetail = categoryList.find((u) => u.id === userId.id)
  //         if (userDetail) {
  //           return {
  //             value: userDetail.id,
  //             label: `${userDetail?.firstName} ${userDetail?.lastName}`,
  //           }
  //         }
  //         return null
  //       })
  //       .filter(Boolean) as SelectOption[] // Filter out null values and assert the type
  //     setSelectedUsers(selected || [])
  //   }
  // }, [user, categoryList])

  const [userForEdit] = useState({
    ...user,
    description: user.description,
    title: user.title,
    arbitration: {
      ...user.arbitration,
      refereeId: user.arbitration?.refereeId || currentUser?.id,
    },
  })

  useEffect(() => {
    getAllCategories()
      .then((res) => setCategoryList(res.data))
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

  const userOptions = categoryList.map((user) => ({
    value: user.id || '', // Ensure it's always a string
    label: `${user.title}`,
  }))

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
              disabled={formik.isSubmitting || isUserLoading || currentUser?.role !== 'user'}
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
              disabled={formik.isSubmitting || isUserLoading || currentUser?.role !== 'user'}
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

          {(currentUser?.role === 'admin' || currentUser?.role === 'referee') && (
            <div className='fv-row mb-7'>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-2'>
                {' '}
                {intl.formatMessage({id: 'AUTH.INPUT.MESSAGE'})}
              </label>
              {/* end::Label */}

              {/* begin::Input */}
              <CKEditor
                editor={ClassicEditor.Editor}
                data={formik.values?.arbitration?.message}
                onChange={(event, editor) => {
                  const data = editor.getData()
                  formik.setFieldValue('arbitration.message', data)
                }}
              />
              {formik.touched?.arbitration?.message && formik.errors?.arbitration?.message && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors?.arbitration?.message}</span>
                  </div>
                </div>
              )}
              {/* end::Input */}
            </div>
          )}

          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {intl.formatMessage({id: 'AUTH.INPUT.CATEGORY'})}
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <Select
              options={userOptions}
              value={selectedCategory}
              onChange={(selectedOption: SelectOption | null) => {
                formik.setFieldValue('category', selectedOption ? selectedOption.value : null)
                setSelectedCategory(selectedOption)
              }}
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.CATEGORY'})}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.category && formik.errors.category},
                {
                  'is-valid': formik.touched.category && !formik.errors.category,
                }
              )}
              name='category'
              isDisabled={formik.isSubmitting || isUserLoading || currentUser?.role !== 'user'}
            />

            {/* end::Input */}
            {formik.touched.category && formik.errors.category && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.category}</span>
              </div>
            )}
          </div>

          {(currentUser?.role === 'admin' || currentUser?.role === 'referee') && (
            <div className='mb-7'>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-5'>
                {' '}
                {intl.formatMessage({id: 'AUTH.INPUT.STATUS'})}
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
                    {...formik.getFieldProps('status')}
                    name='status'
                    type='radio'
                    value='pending'
                    id='kt_modal_update_role_option_0'
                    checked={formik.values.status === 'pending'}
                    disabled={formik.isSubmitting || isUserLoading}
                  />

                  {/* end::Input */}

                  {/* begin::Label */}
                  <label className='form-check-label' htmlFor='kt_modal_update_role_option_0'>
                    <div className='fw-bolder text-gray-800'>
                      {intl.formatMessage({id: 'AUTH.INPUT.PENDING'})}
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
                    {...formik.getFieldProps('status')}
                    name='status'
                    type='radio'
                    value='failed'
                    id='kt_modal_update_role_option_1'
                    checked={formik.values.status === 'failed'}
                    disabled={formik.isSubmitting || isUserLoading}
                  />
                  {/* end::Input */}
                  {/* begin::Label */}
                  <label className='form-check-label' htmlFor='kt_modal_update_role_option_1'>
                    <div className='fw-bolder text-gray-800'>
                      {' '}
                      {intl.formatMessage({id: 'AUTH.INPUT.FAILED'})}
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
                    {...formik.getFieldProps('status')}
                    name='status'
                    type='radio'
                    value='success'
                    id='kt_modal_update_role_option_2'
                    checked={formik.values.status === 'success'}
                    disabled={formik.isSubmitting || isUserLoading}
                  />

                  {/* end::Input */}
                  {/* begin::Label */}
                  <label className='form-check-label' htmlFor='kt_modal_update_role_option_2'>
                    <div className='fw-bolder text-gray-800'>
                      {' '}
                      {intl.formatMessage({id: 'AUTH.INPUT.SUCCESS'})}
                    </div>
                  </label>
                  {/* end::Label */}
                </div>
                {/* end::Radio */}
              </div>
            </div>
          )}

          {/* begin::Input group */}

          {/* <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>
              {intl.formatMessage({id: 'AUTH.INPUT.GENDER'})}
            </label>

            <Select
              isMulti
              options={userOptions}
              value={selectedUsers}
              onChange={(selectedOptions: readonly SelectOption[] | null) => {
                const selectedIds = selectedOptions
                  ? selectedOptions.map((option) => option.value)
                  : []
                formik.setFieldValue('referees', selectedIds)
                setSelectedUsers(selectedOptions ? Array.from(selectedOptions) : [])
              }}
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.GENDER'})}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.referees && formik.errors.referees},
                {
                  'is-valid': formik.touched.referees && !formik.errors.referees,
                }
              )}
              name='referees'
              isDisabled={formik.isSubmitting || isUserLoading}
            />

            {formik.touched.referees && formik.errors.referees && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.referees}</span>
              </div>
            )}
          </div> */}

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
