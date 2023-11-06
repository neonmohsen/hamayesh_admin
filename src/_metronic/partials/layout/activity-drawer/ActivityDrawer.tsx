import React, {FC} from 'react'
import {Link} from 'react-router-dom'
import {EventDetails} from '../../../../app/modules/accounts/components/settings/cards/EventDetails'
import {KTIcon} from '../../../helpers'

// Define an interface for the component's props

const ActivityDrawer = (eventDetails: any) => (
  <div
    id='kt_activities'
    // className='bg-white'
    data-kt-drawer='true'
    data-kt-drawer-name='activities'
    data-kt-drawer-activate='true'
    data-kt-drawer-overlay='true'
    data-kt-drawer-width="{default:'300px', 'lg': '900px'}"
    data-kt-drawer-direction='end'
    data-kt-drawer-toggle='#kt_activities_toggle'
    data-kt-drawer-close='#kt_activities_close'
  >
    <div className='card shadow-none rounded-0 w-100'>
      <div className='card-header' id='kt_activities_header'>
        <h3 className='card-title fw-bold text-dark'>Activity Logs</h3>

        <div className='card-toolbar'>
          <button
            type='button'
            className='btn btn-sm btn-icon btn-active-light-primary me-n5'
            id='kt_activities_close'
          >
            <KTIcon iconName='cross' className='fs-1' />
          </button>
        </div>
      </div>
      <div className='card-body position-relative' id='kt_activities_body'>
        <div
          id='kt_activities_scroll'
          className='position-relative scroll-y me-n5 pe-5'
          data-kt-scroll='true'
          data-kt-scroll-height='auto'
          data-kt-scroll-wrappers='#kt_activities_body'
          data-kt-scroll-dependencies='#kt_activities_header, #kt_activities_footer'
          data-kt-scroll-offset='5px'
        >
          {eventDetails && <EventDetails eventDetails={eventDetails} />}

          {/* <div className='timeline'>
            <Item1 />
            <Item2 />
            <Item3 />
            <Item4 />
            <Item5 />
            <Item6 />
            <Item7 />
            <Item8 />
          </div> */}
        </div>
      </div>
      <div className='card-footer py-5 text-center' id='kt_activities_footer'>
        <Link to='/crafted/pages/profile' className='btn btn-bg-white text-primary'>
          View All Activities
          <KTIcon iconName='arrow-right' className='fs-3 text-primary' />
        </Link>
      </div>
    </div>
  </div>
)

export {ActivityDrawer}
