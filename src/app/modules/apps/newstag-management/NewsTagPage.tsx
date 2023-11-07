import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'مدیریت تگ ها',
    path: '/apps/newstag-management/newstags',
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

const NewsTagPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='newstags'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>لیست تگ ها</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/newstag-management/newstags' />} />
    </Routes>
  )
}

export default NewsTagPage
