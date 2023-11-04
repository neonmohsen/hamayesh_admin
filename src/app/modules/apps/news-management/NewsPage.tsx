import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'News Management',
    path: '/apps/user-management/users',
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

const NewsPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='news'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>News list</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/news-management/news' />} />
    </Routes>
  )
}

export default NewsPage
