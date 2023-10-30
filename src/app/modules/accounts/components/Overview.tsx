/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {useIntl} from 'react-intl'
import {Link} from 'react-router-dom'

import {useAuth} from '../../auth'

export function Overview() {
  const intl = useIntl()
  const {currentUser} = useAuth()

  return (
    <>
      <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
        <div className='card-header cursor-pointer'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>
              {intl.formatMessage({id: 'AUTH.INPUT.PROFILEDETAIL'})}
            </h3>
          </div>

          <Link to='/crafted/account/settings' className='btn btn-primary align-self-center'>
            {intl.formatMessage({id: 'USER.SETTING.TITLE'})}{' '}
          </Link>
        </div>

        <div className='card-body p-9'>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.FULLNAME'})}
            </label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>
                {currentUser?.firstName} {currentUser?.lastName}{' '}
              </span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.JOB'})}
            </label>

            <div className='col-lg-8 fv-row'>
              <span className='fw-bold fs-6'>{currentUser?.job}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.STUDYFIELD'})}
            </label>

            <div className='col-lg-8 fv-row'>
              <span className='fw-bold fs-6'>{currentUser?.study_field}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>
              {intl.formatMessage({id: 'AUTH.INPUT.EMAIL'})}
              <i
                className='fas fa-exclamation-circle ms-1 fs-7'
                data-bs-toggle='tooltip'
                title='Phone number must be active'
              ></i>
            </label>

            <div className='col-lg-8 d-flex align-items-center'>
              <span className='fw-bolder fs-6 me-2'>{currentUser?.email}</span>
              {currentUser?.emailVerifiedAt && (
                <span className='badge badge-success'>Verified</span>
              )}
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.PHONENUMBER'})}
            </label>

            <div className='col-lg-8'>
              <a href='#' className='fw-bold fs-6 text-dark text-hover-primary'>
                {currentUser?.phoneNumber}
              </a>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>
              {intl.formatMessage({id: 'AUTH.INPUT.NATIONALID'})}
            </label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{currentUser?.national_id}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>
              {' '}
              {intl.formatMessage({id: 'AUTH.INPUT.INSTITUTE'})}
            </label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{currentUser?.institute}</span>
            </div>
          </div>
        </div>
      </div>
      {/* 
      <div className='row gy-10 gx-xl-10'>
        <div className='col-xl-6'>
          <ChartsWidget1 className='card-xxl-stretch mb-5 mb-xl-10' />
        </div>

        <div className='col-xl-6'>
          <TablesWidget1 className='card-xxl-stretch mb-5 mb-xl-10' />
        </div>
      </div>

      <div className='row gy-10 gx-xl-10'>
        <div className='col-xl-6'>
          <ListsWidget5 className='card-xxl-stretch mb-5 mb-xl-10' />
        </div>

        <div className='col-xl-6'>
          <TablesWidget5 className='card-xxl-stretch mb-5 mb-xl-10' />
        </div>
      </div> */}
    </>
  )
}
