import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'مدیریت دسته بندی مقالات',
    path: '/apps/articlecategories-management/articlecategories',
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

const ArticleCategoriesPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='articlecategories'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>لیست دسته بندی</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route
        index
        element={<Navigate to='/apps/articlecategories-management/articlecategories' />}
      />
    </Routes>
  )
}

export default ArticleCategoriesPage
