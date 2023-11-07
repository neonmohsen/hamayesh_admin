import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'مدیریت مقالات',
    path: '/apps/article-management/articles',
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

const ArticlesPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='articles'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>لیست مقالات</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/article-management/articles' />} />
    </Routes>
  )
}

export default ArticlesPage
