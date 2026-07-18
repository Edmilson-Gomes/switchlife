import { Greeting } from '../features/dashboard/components/Greeting'
import { QuickActions } from '../features/dashboard/components/QuickActions'
import { DashboardSummary } from '../features/dashboard/components/DashboardSummary'
import { FutureModulesGrid } from '../features/dashboard/components/FutureModulesGrid'
import { InstallPrompt } from '../features/offline/components/InstallPrompt'

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <Greeting />
      <InstallPrompt />
      <QuickActions />
      <DashboardSummary />
      <FutureModulesGrid />
    </div>
  )
}
