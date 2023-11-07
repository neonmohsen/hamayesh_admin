import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'مدیریت کامنت ها',
    path: '/apps/newscomment-management/newscomments',
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

const NewsCommentPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='newscomments'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>لیست کامنت ها</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/newscomment-management/newscomments' />} />
    </Routes>
  )
}

export default NewsCommentPage
