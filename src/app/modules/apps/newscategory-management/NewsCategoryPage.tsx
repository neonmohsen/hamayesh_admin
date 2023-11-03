import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'News Category Management',
    path: '/apps/newscategory-management/newscategories',
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

const NewsCategoryPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='newscategories'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Users list</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/newscategory-management/newscategories' />} />
    </Routes>
  )
}

export default NewsCategoryPage
