import { useAuth } from './AuthProvider'
import LoginForm from './LoginForm'
import SuperAdminDashboard from './SuperAdminDashboard'
import ClientAdminDashboard from './ClientAdminDashboard'
import SurveyPersonFlow from './SurveyPersonFlow'
import { Button } from '@/components/ui/button'

export default function SurveyApp() {
  const { currentUser, logout } = useAuth()

  if (!currentUser) {
    return <LoginForm />
  }

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'super-admin': return 'Super Admin'
      case 'client-admin': return 'Client Admin'
      case 'survey-person': return 'Survey Person'
      default: return role
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-lg border-b-4 border-indigo-500">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Survey Portal</h1>
              <p className="text-sm text-indigo-600 font-medium">
                {getRoleDisplayName(currentUser.role)} - {currentUser.name}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={logout}
            className="border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 font-medium px-6 py-2"
          >
            Logout
          </Button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto">
        {currentUser.role === 'super-admin' && <SuperAdminDashboard />}
        {currentUser.role === 'client-admin' && <ClientAdminDashboard />}
        {currentUser.role === 'survey-person' && <SurveyPersonFlow />}
      </main>
    </div>
  )
}