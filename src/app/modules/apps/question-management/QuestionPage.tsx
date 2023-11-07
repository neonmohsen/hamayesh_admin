import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'مدیریت سوالات متداول',
    path: '/apps/question-management/questions',
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

const QuestionPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='questions'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>لیست سوالات</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/question-management/questions' />} />
    </Routes>
  )
}

export default QuestionPage
