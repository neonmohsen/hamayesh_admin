import {FC, useEffect, useState} from 'react'
import {Outlet, useLocation} from 'react-router-dom'
import {AsideDefault} from './components/aside/AsideDefault'
import {Footer} from './components/Footer'
import {HeaderWrapper} from './components/header/HeaderWrapper'
import {Toolbar} from './components/toolbar/Toolbar'
import {ScrollTop} from './components/ScrollTop'
import {Content} from './components/Content'
import {PageDataProvider, useLayout} from './core'
import {ActivityDrawer, DrawerMessenger, InviteUsers, RightToolbar, UpgradePlan} from '../partials'
import {themeModeSwitchHelper, useThemeMode} from '../partials/layout/theme-mode/ThemeModeProvider'
import {MenuComponent} from '../../_metronic/assets/ts/components'
import clsx from 'clsx'
import {WithChildren} from '../helpers'
import {getEventDetails} from '../../app/modules/auth/core/_requests'
import {useAuth} from '../../app/modules/auth'

const MasterLayout: FC<WithChildren> = ({children}) => {
  const {classes} = useLayout()
  const {mode} = useThemeMode()
  const location = useLocation()
  const [eventDetails, setEventDetails] = useState<any>()

  const {currentUser} = useAuth()

  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization()
    }, 500)
  }, [location.key])

  useEffect(() => {
    themeModeSwitchHelper(mode)
  }, [mode])

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      getEventDetails()
        .then((data) => setEventDetails(data.data.data))
        .catch((err) => console.log(err))
    }

    // similarly for fetchCities if needed
  }, [currentUser])

  return (
    <PageDataProvider>
      <div className='page d-flex flex-row flex-column-fluid'>
        <div className='wrapper d-flex flex-column flex-row-fluid' id='kt_wrapper'>
          <HeaderWrapper />

          <div id='kt_content' className='content d-flex flex-column flex-column-fluid'>
            <Toolbar />
            <div
              className={clsx(
                'd-flex flex-column-fluid align-items-start',
                classes.contentContainer.join(' ')
              )}
              id='kt_post'
            >
              <AsideDefault />
              <Content>
                <Outlet />
              </Content>
            </div>
          </div>
          <Footer />
        </div>
      </div>

      {/* begin:: Drawers */}
      {eventDetails && <ActivityDrawer eventDetails={eventDetails} />}
      <RightToolbar />
      <DrawerMessenger />
      {/* end:: Drawers */}

      {/* begin:: Modals */}
      <InviteUsers />
      <UpgradePlan />
      {/* end:: Modals */}
      <ScrollTop />
    </PageDataProvider>
  )
}

export {MasterLayout}
