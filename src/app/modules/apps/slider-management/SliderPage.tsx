import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'مدیریت اسلایدر',
    path: '/apps/slider-management/sliders',
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

const SliderPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='sliders'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>لیست اسلایدر ها</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/slider-management/sliders' />} />
    </Routes>
  )
}

export default SliderPage
