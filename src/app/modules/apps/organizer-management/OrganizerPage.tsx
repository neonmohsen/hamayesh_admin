import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'مدیریت برگذارکننده ها',
    path: '/apps/organizer-management/organizers',
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

const OrganizerPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='organizers'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>لیست برگذارکننده ها</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/organizer-management/organizers' />} />
    </Routes>
  )
}

export default OrganizerPage
