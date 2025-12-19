import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from './AuthProvider'

export default function SuperAdminDashboard() {
  const { clients, addClient } = useAuth()
  const [newClient, setNewClient] = useState({ name: '', email: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleAddClient = async () => {
    if (newClient.name && newClient.email) {
      setIsLoading(true)
      try {
        addClient(newClient)
        setNewClient({ name: '', email: '' })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">System Administration</h1>
            <p className="text-slate-600 mt-2 text-lg">Manage client organizations and system settings</p>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 px-6 py-3 rounded-xl">
            <span className="text-sm font-bold text-amber-800 uppercase tracking-wide">Super Admin Access</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">👥</span>
              </div>
              <div className="ml-5">
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Clients</p>
                <p className="text-3xl font-bold text-slate-800">{clients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">✅</span>
              </div>
              <div className="ml-5">
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Active Organizations</p>
                <p className="text-3xl font-bold text-slate-800">{clients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">📊</span>
              </div>
              <div className="ml-5">
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">System Status</p>
                <p className="text-xl font-bold text-green-600">Operational</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Create Client Form */}
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-shadow duration-200">
            <CardHeader className="border-b-2 border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-xl font-bold text-slate-800">
                Add New Client Organization
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form className="space-y-6">
                <div>
                  <Label htmlFor="client-name" className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                    Organization Name
                  </Label>
                  <Input
                    id="client-name"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    placeholder="Enter organization name"
                    className="w-full h-12 px-4 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                
                <div>
                  <Label htmlFor="client-email" className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                    Administrator Email
                  </Label>
                  <Input
                    id="client-email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="admin@organization.com"
                    className="w-full h-12 px-4 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                
                <Button 
                  type="button"
                  onClick={handleAddClient} 
                  disabled={!newClient.name || !newClient.email || isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {isLoading ? 'Creating Organization...' : 'Create Client Organization'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Client List */}
        <div className="lg:col-span-3">
          <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-shadow duration-200">
            <CardHeader className="border-b-2 border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100">
              <CardTitle className="text-xl font-bold text-slate-800">
                Client Organizations ({clients.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {clients.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-slate-400 text-3xl">🏢</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">No client organizations yet</h3>
                  <p className="text-slate-600">Create your first client organization to get started.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {clients.map((client) => (
                    <div key={client.id} className="p-8 hover:bg-slate-50 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-5">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-2xl">
                              {client.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-800">{client.name}</h3>
                            <p className="text-sm text-slate-600 font-medium">{client.email}</p>
                            <p className="text-xs text-slate-500 mt-2 bg-slate-100 px-3 py-1 rounded-full inline-block">
                              Created on {new Date(client.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-800 border border-green-200">
                            Active
                          </span>
                          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            Client Admin
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}