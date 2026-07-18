import { createHashRouter } from 'react-router-dom'
import { RequireAuth } from '../features/auth/components/RequireAuth'
import { RedirectIfAuthenticated } from '../features/auth/components/RedirectIfAuthenticated'
import { AppLayout } from '../components/layout/AppLayout'
import { LoginPage } from '../pages/LoginPage'
import { SignUpPage } from '../pages/SignUpPage'
import { ResetPasswordPage } from '../pages/ResetPasswordPage'
import { DashboardPage } from '../pages/DashboardPage'
import { NotesListPage } from '../pages/NotesListPage'
import { NoteFormPage } from '../pages/NoteFormPage'
import { NoteDetailPage } from '../pages/NoteDetailPage'
import { ListsPage } from '../pages/ListsPage'
import { ListFormPage } from '../pages/ListFormPage'
import { ListDetailPage } from '../pages/ListDetailPage'
import { SharedWithMePage } from '../pages/SharedWithMePage'
import { ProfilePage } from '../pages/ProfilePage'
import { SettingsPage } from '../pages/SettingsPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { RootRedirect } from '../pages/RootRedirect'

export const router = createHashRouter([
  {
    element: <RedirectIfAuthenticated />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/cadastro', element: <SignUpPage /> },
      { path: '/recuperar-senha', element: <ResetPasswordPage /> },
    ],
  },
  {
    path: '/app',
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'inicio', element: <DashboardPage /> },
          { path: 'anotacoes', element: <NotesListPage /> },
          { path: 'anotacoes/nova', element: <NoteFormPage /> },
          { path: 'anotacoes/:id', element: <NoteDetailPage /> },
          { path: 'listas', element: <ListsPage /> },
          { path: 'listas/nova', element: <ListFormPage /> },
          { path: 'listas/:id', element: <ListDetailPage /> },
          { path: 'compartilhados', element: <SharedWithMePage /> },
          { path: 'perfil', element: <ProfilePage /> },
          { path: 'configuracoes', element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: '/', element: <RootRedirect /> },
  { path: '*', element: <NotFoundPage /> },
])
