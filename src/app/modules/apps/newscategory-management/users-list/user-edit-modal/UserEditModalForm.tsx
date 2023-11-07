import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {initialUser, User} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {createUser, getAllUsers, updateUser} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {useIntl} from 'react-intl'
import {profileImage} from '../../../../auth/core/_requests'
import {CKEditor} from '@ckeditor/ckeditor5-react'
import ClassicEditor from '../../../../../../build/ckeditor'

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
      const response = await profileImage(file, 'image')

      if (response.data.status === 'success') {
        const imagePath = response.data.data.image[0].path
        formik.setFieldValue('image', imagePath)
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
      formik.setFieldError('image', errorMessage)

      // If you have a general 'status' field for displaying global form messages, you can use this too
      formik.setStatus('Failed to upload image.')
    }
  }

  const [userForEdit] = useState<User>({
    ...user,
    image: user.image || initialUser.image,
    title: user.title || initialUser.title,
    description: user.description || initialUser.description,
  })

  const [categoryList, setCategoryList] = useState<any>([])

  useEffect(() => {
    getAllUsers()
      .then((res) => setCategoryList(res.data))
      .catch()
  }, [])

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

  const userAvatarImg = toAbsoluteUrl(`${process.env.REACT_APP_BASE_URL}/${formik.values.image}`)
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
            <CKEditor
              editor={ClassicEditor.Editor}
              data={formik.values.description}
              onChange={(event, editor) => {
                const data = editor.getData()
                formik.setFieldValue('description', data)
              }}
              onBlur={() => formik.setTouched({...formik.touched, description: true})}
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
          <div className='fv-row mb-7 '>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>
              {intl.formatMessage({id: 'AUTH.INPUT.CATEGORY'})}
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <select
              placeholder={intl.formatMessage({id: 'AUTH.INPUT.CATEGORY'})}
              {...formik.getFieldProps('parent')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.parent && formik.errors.parent},
                {
                  'is-valid': formik.touched.parent && !formik.errors.parent,
                }
              )}
              name='parent'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            >
              <option value=''> {intl.formatMessage({id: 'AUTH.INPUT.CATEGORY'})}</option>
              {categoryList.map((item) => {
                return <option value={item.id}>{item.title}</option>
              })}
            </select>
            {/* end::Input */}
            {formik.touched.parent && formik.errors.parent && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.parent}</span>
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
