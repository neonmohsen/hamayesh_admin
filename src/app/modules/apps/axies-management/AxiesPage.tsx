import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'مدیریت محور ها',
    path: '/apps/axies-management/axies',
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

const AxiesPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='axies'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>لیست محور ها</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/axies-management/axies' />} />
    </Routes>
  )
}

export default AxiesPage
