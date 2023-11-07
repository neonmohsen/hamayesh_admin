import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'مدیریت حامیان',
    path: '/apps/supporter-management/supporters',
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

const SupporterPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='supporters'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>لیست حامیان</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/supporter-management/supporters' />} />
    </Routes>
  )
}

export default SupporterPage
