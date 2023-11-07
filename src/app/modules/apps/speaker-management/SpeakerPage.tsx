import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'مدیریت سخنرانان',
    path: '/apps/speaker-management/speakers',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const SpeakerPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='speakers'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>لیست سخنرانان</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/speaker-management/speakers' />} />
    </Routes>
  )
}

export default SpeakerPage
