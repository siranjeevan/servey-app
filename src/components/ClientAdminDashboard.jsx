import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from './AuthProvider'

export default function ClientAdminDashboard() {
  const { currentUser, addSurveyPerson, addQuestion, getClientSurveyPersons, getClientQuestions } = useAuth()
  const [newPerson, setNewPerson] = useState({ name: '', email: '' })
  const [newQuestion, setNewQuestion] = useState({ text: '', type: 'text', options: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const surveyPersons = getClientSurveyPersons(currentUser.id)
  const questions = getClientQuestions(currentUser.id)

  const handleAddSurveyPerson = async () => {
    if (newPerson.name && newPerson.email) {
      setIsLoading(true)
      try {
        addSurveyPerson(newPerson, currentUser.id)
        setNewPerson({ name: '', email: '' })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleAddQuestion = async () => {
    if (newQuestion.text) {
      setIsLoading(true)
      try {
        const question = {
          ...newQuestion,
          options: newQuestion.type === 'options' ? newQuestion.options.split(',').map(o => o.trim()).filter(o => o) : []
        }
        addQuestion(question, currentUser.id)
        setNewQuestion({ text: '', type: 'text', options: '' })
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
            <h1 className="text-3xl font-bold text-slate-800">Organization Dashboard</h1>
            <p className="text-slate-600 mt-2 text-lg">Manage survey personnel and questionnaires</p>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 px-6 py-3 rounded-xl">
            <span className="text-sm font-bold text-amber-800 uppercase tracking-wide">Client Admin Access</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: '📊' },
            { id: 'personnel', name: 'Personnel', icon: '👥' },
            { id: 'questions', name: 'Questions', icon: '❓' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Survey Personnel</p>
                    <p className="text-2xl font-bold text-gray-900">{surveyPersons.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-xl">❓</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Survey Questions</p>
                    <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">📝</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Text Questions</p>
                    <p className="text-2xl font-bold text-gray-900">{questions.filter(q => q.type === 'text').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 text-xl">📋</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Choice Questions</p>
                    <p className="text-2xl font-bold text-gray-900">{questions.filter(q => q.type === 'options').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader className="border-b border-gray-200 bg-gray-50">
                <CardTitle className="text-lg font-semibold text-gray-900">Add Survey Personnel</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="person-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </Label>
                    <Input
                      id="person-name"
                      value={newPerson.name}
                      onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                      placeholder="Enter full name"
                      className="w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="person-email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </Label>
                    <Input
                      id="person-email"
                      type="email"
                      value={newPerson.email}
                      onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
                      placeholder="person@email.com"
                      className="w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <Button 
                    onClick={handleAddSurveyPerson} 
                    disabled={!newPerson.name || !newPerson.email || isLoading}
                    className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                  >
                    {isLoading ? 'Adding...' : 'Add Personnel'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader className="border-b border-gray-200 bg-gray-50">
                <CardTitle className="text-lg font-semibold text-gray-900">Create Survey Question</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="question-text" className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text
                    </Label>
                    <Textarea
                      id="question-text"
                      value={newQuestion.text}
                      onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                      placeholder="Enter your survey question..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="question-type" className="block text-sm font-medium text-gray-700 mb-2">
                      Response Type
                    </Label>
                    <Select value={newQuestion.type} onValueChange={(value) => setNewQuestion({ ...newQuestion, type: value, options: '' })}>
                      <SelectTrigger className="w-full h-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text Response</SelectItem>
                        <SelectItem value="options">Multiple Choice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newQuestion.type === 'options' && (
                    <div>
                      <Label htmlFor="question-options" className="block text-sm font-medium text-gray-700 mb-2">
                        Answer Options (comma-separated)
                      </Label>
                      <Input
                        id="question-options"
                        value={newQuestion.options}
                        onChange={(e) => setNewQuestion({ ...newQuestion, options: e.target.value })}
                        placeholder="Option 1, Option 2, Option 3"
                        className="w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                  <Button 
                    onClick={handleAddQuestion} 
                    disabled={!newQuestion.text || isLoading}
                    className="w-full h-10 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors"
                  >
                    {isLoading ? 'Adding...' : 'Add Question'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Personnel Tab */}
      {activeTab === 'personnel' && (
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="border-b border-gray-200 bg-gray-50">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Survey Personnel ({surveyPersons.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {surveyPersons.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">👥</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No personnel added yet</h3>
                <p className="text-gray-500">Add survey personnel to start collecting responses.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {surveyPersons.map((person) => (
                  <div key={person.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {person.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{person.name}</h3>
                          <p className="text-sm text-gray-600">{person.email}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Added on {new Date(person.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Survey Personnel
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="border-b border-gray-200 bg-gray-50">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Survey Questions ({questions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {questions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">❓</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions created yet</h3>
                <p className="text-gray-500">Create survey questions to start collecting data.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {questions.map((question, index) => (
                  <div key={question.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{question.text}</h3>
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            question.type === 'text' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {question.type === 'text' ? '📝 Text Response' : '📋 Multiple Choice'}
                          </span>
                          {question.options && question.options.length > 0 && (
                            <span className="text-xs text-gray-500">
                              {question.options.length} options
                            </span>
                          )}
                        </div>
                        {question.options && question.options.length > 0 && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs font-medium text-gray-700 mb-2">Answer Options:</p>
                            <div className="flex flex-wrap gap-2">
                              {question.options.map((option, optionIndex) => (
                                <span key={optionIndex} className="inline-flex items-center px-2 py-1 rounded text-xs bg-white border border-gray-200 text-gray-700">
                                  {option}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}