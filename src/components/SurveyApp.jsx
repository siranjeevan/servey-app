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
      <header className="bg-white shadow-lg border-b-2 border-amber-500">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">V Survey</h1>
                <p className="text-sm text-slate-600 font-medium">
                  {getRoleDisplayName(currentUser.role)} • {currentUser.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                  {getRoleDisplayName(currentUser.role)}
                </span>
              </div>
              <Button 
                variant="outline" 
                onClick={logout}
                className="border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 font-semibold px-6 py-2 rounded-lg transition-all duration-200"
              >
                Sign Out
              </Button>
            </div>
          </div>
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