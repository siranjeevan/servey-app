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
    <div className="p-8 space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-800 mb-2">
          Super Admin Dashboard
        </h2>
        <p className="text-slate-600 text-lg">Manage client accounts and system administration</p>
        <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-indigo-600 text-white py-6">
            <CardTitle className="text-xl font-semibold">Create New Client</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="client-name" className="text-slate-700 font-semibold text-sm uppercase tracking-wide">Client Name</Label>
              <Input
                id="client-name"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                placeholder="Enter client organization name"
                className="h-12 border-2 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="client-email" className="text-slate-700 font-semibold text-sm uppercase tracking-wide">Client Email</Label>
              <Input
                id="client-email"
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                placeholder="Enter client admin email"
                className="h-12 border-2 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
              />
            </div>
            <Button 
              onClick={handleAddClient} 
              disabled={!newClient.name || !newClient.email || isLoading}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? 'Creating Account...' : 'Create Client Account'}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-slate-100 border-b-2 border-slate-200 py-6">
            <CardTitle className="text-xl font-semibold text-slate-800">Active Clients ({clients.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {clients.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-slate-400">👥</span>
                </div>
                <p className="text-slate-500 font-medium text-lg">No clients yet</p>
                <p className="text-sm text-slate-400 mt-2">Create your first client account to get started</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {clients.map((client) => (
                  <div key={client.id} className="p-5 border-2 border-slate-100 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-slate-200 transition-all duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-lg">{client.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 text-lg">{client.name}</div>
                          <div className="text-indigo-600 font-medium">{client.email}</div>
                          <div className="text-xs text-slate-500 mt-2 bg-white px-2 py-1 rounded">
                            Created: {new Date(client.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <span className="px-3 py-2 bg-indigo-100 text-indigo-800 text-sm font-semibold rounded-lg">
                        Client Admin
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}