import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'
import {useAuth} from '../modules/auth'
import ArticlesPage from '../modules/apps/articles-management/ArticlesPage'

const PrivateRoutes = () => {
  const {currentUser} = useAuth()
  console.log(currentUser)
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'))
  const SupporterPage = lazy(() => import('../modules/apps/supporter-management/SupporterPage'))
  const SpeakerPage = lazy(() => import('../modules/apps/speaker-management/SpeakerPage'))
  const SliderPage = lazy(() => import('../modules/apps/slider-management/SliderPage'))
  const SecretariatsPage = lazy(
    () => import('../modules/apps/secretariat-management/SecretariatPage')
  )
  const QuestionPage = lazy(() => import('../modules/apps/question-management/QuestionPage'))
  const OrganizerPage = lazy(() => import('../modules/apps/organizer-management/OrganizerPage'))
  const NewsTagPage = lazy(() => import('../modules/apps/newstag-management/NewsTagPage'))
  const NewsCommentPage = lazy(
    () => import('../modules/apps/newscomment-management/NewsCommentPage')
  )
  const NewsCategoryPage = lazy(
    () => import('../modules/apps/newscategory-management/NewsCategoryPage')
  )
  const NewsPage = lazy(() => import('../modules/apps/news-management/NewsPage'))
  const ArticleCategoriesPage = lazy(
    () => import('../modules/apps/articleCategories-management/ArticleCategoriesPage')
  )

  const AxiesPage = lazy(() => import('../modules/apps/axies-management/AxiesPage'))

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='dashboard' element={<DashboardWrapper />} />
        <Route path='builder' element={<BuilderPageWrapper />} />
        <Route path='menu-test' element={<MenuTestPage />} />
        {/* Lazy Modules */}
        <Route
          path='crafted/pages/profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/chat/*'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        {(currentUser?.role === 'admin' || currentUser?.role === 'executive') && (
          <Route
            path='apps/user-management/*'
            element={
              <SuspensedView>
                <UsersPage />
              </SuspensedView>
            }
          />
        )}
        {(currentUser?.role === 'admin' || currentUser?.role === 'executive') && (
          <Route
            path='apps/supporter-management/*'
            element={
              <SuspensedView>
                <SupporterPage />
              </SuspensedView>
            }
          />
        )}
        {(currentUser?.role === 'admin' || currentUser?.role === 'executive') && (
          <Route
            path='apps/speaker-management/*'
            element={
              <SuspensedView>
                <SpeakerPage />
              </SuspensedView>
            }
          />
        )}
        {(currentUser?.role === 'admin' || currentUser?.role === 'executive') && (
          <Route
            path='apps/slider-management/*'
            element={
              <SuspensedView>
                <SliderPage />
              </SuspensedView>
            }
          />
        )}

        {(currentUser?.role === 'admin' || currentUser?.role === 'executive') && (
          <Route
            path='apps/question-management/*'
            element={
              <SuspensedView>
                <QuestionPage />
              </SuspensedView>
            }
          />
        )}
        {(currentUser?.role === 'admin' || currentUser?.role === 'executive') && (
          <Route
            path='apps/organizer-management/*'
            element={
              <SuspensedView>
                <OrganizerPage />
              </SuspensedView>
            }
          />
        )}

        {(currentUser?.role === 'admin' || currentUser?.role === 'executive') && (
          <Route
            path='apps/newstag-management/*'
            element={
              <SuspensedView>
                <NewsTagPage />
              </SuspensedView>
            }
          />
        )}

        {(currentUser?.role === 'admin' || currentUser?.role === 'executive') && (
          <Route
            path='apps/newscomment-management/*'
            element={
              <SuspensedView>
                <NewsCommentPage />
              </SuspensedView>
            }
          />
        )}
        {(currentUser?.role === 'admin' || currentUser?.role === 'executive') && (
          <Route
            path='apps/newscategory-management/*'
            element={
              <SuspensedView>
                <NewsCategoryPage />
              </SuspensedView>
            }
          />
        )}
        {(currentUser?.role === 'admin' || currentUser?.role === 'executive') && (
          <Route
            path='apps/news-management/*'
            element={
              <SuspensedView>
                <NewsPage />
              </SuspensedView>
            }
          />
        )}
        {(currentUser?.role === 'admin' || currentUser?.role === 'scientific') && (
          <Route
            path='apps/articlecategories-management/*'
            element={
              <SuspensedView>
                <ArticleCategoriesPage />
              </SuspensedView>
            }
          />
        )}

        {(currentUser?.role === 'admin' || currentUser?.role === 'executive') && (
          <Route
            path='apps/axies-management/*'
            element={
              <SuspensedView>
                <AxiesPage />
              </SuspensedView>
            }
          />
        )}
        {(currentUser?.role === 'admin' ||
          currentUser?.role === 'referee' ||
          currentUser?.role === 'scientific') && (
          <Route
            path='apps/article-management/*'
            element={
              <SuspensedView>
                <ArticlesPage />
              </SuspensedView>
            }
          />
        )}
        {currentUser?.role === 'admin' && (
          <Route
            path='apps/secretariat-management/*'
            element={
              <SuspensedView>
                <SecretariatsPage />
              </SuspensedView>
            }
          />
        )}
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
