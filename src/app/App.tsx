import { RouterProvider } from 'react-router-dom'
import { AppProviders } from './providers'
import { router } from './router'
import { OfflineBanner } from '../features/offline/components/OfflineBanner'
import { UpdatePrompt } from '../features/offline/components/UpdatePrompt'

export function App() {
  return (
    <AppProviders>
      <OfflineBanner />
      <RouterProvider router={router} />
      <UpdatePrompt />
    </AppProviders>
  )
}
