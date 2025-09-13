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
    <div className="p-6 space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-800 mb-2">
          Client Admin Dashboard
        </h2>
        <p className="text-slate-600 text-lg">Manage survey personnel and create questionnaires</p>
        <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-emerald-600 text-white py-6">
            <CardTitle className="text-xl font-semibold">Add Survey Personnel</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="person-name" className="text-slate-700 font-semibold text-sm uppercase tracking-wide">Full Name</Label>
              <Input
                id="person-name"
                value={newPerson.name}
                onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                placeholder="Enter full name"
                className="h-12 border-2 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="person-email" className="text-slate-700 font-semibold text-sm uppercase tracking-wide">Email Address</Label>
              <Input
                id="person-email"
                type="email"
                value={newPerson.email}
                onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
                placeholder="Enter email address"
                className="h-12 border-2 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
              />
            </div>
            <Button 
              onClick={handleAddSurveyPerson} 
              disabled={!newPerson.name || !newPerson.email || isLoading}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? 'Creating Account...' : 'Create Survey Account'}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-violet-600 text-white py-6">
            <CardTitle className="text-xl font-semibold">Create Survey Question</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="question-text" className="text-slate-700 font-semibold text-sm uppercase tracking-wide">Question Text</Label>
              <Textarea
                id="question-text"
                value={newQuestion.text}
                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                placeholder="Enter your survey question here..."
                rows={4}
                className="border-2 border-slate-200 focus:border-violet-500 focus:ring-violet-500 rounded-lg resize-none"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="question-type" className="text-slate-700 font-semibold text-sm uppercase tracking-wide">Response Type</Label>
              <Select value={newQuestion.type} onValueChange={(value) => setNewQuestion({ ...newQuestion, type: value, options: '' })}>
                <SelectTrigger className="h-12 border-2 border-slate-200 focus:border-violet-500 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Response</SelectItem>
                  <SelectItem value="options">Multiple Choice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newQuestion.type === 'options' && (
              <div className="space-y-3">
                <Label htmlFor="question-options" className="text-slate-700 font-semibold text-sm uppercase tracking-wide">Answer Options</Label>
                <Input
                  id="question-options"
                  value={newQuestion.options}
                  onChange={(e) => setNewQuestion({ ...newQuestion, options: e.target.value })}
                  placeholder="Option 1, Option 2, Option 3"
                  className="h-12 border-2 border-slate-200 focus:border-violet-500 focus:ring-violet-500 rounded-lg"
                />
              </div>
            )}
            <Button 
              onClick={handleAddQuestion} 
              disabled={!newQuestion.text || isLoading}
              className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? 'Adding Question...' : 'Add Question'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-slate-100 border-b-2 border-slate-200 py-6">
            <CardTitle className="text-xl font-semibold text-slate-800">Survey Personnel ({surveyPersons.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {surveyPersons.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-slate-400">👤</span>
                </div>
                <p className="text-slate-500 font-medium text-lg">No personnel yet</p>
                <p className="text-sm text-slate-400 mt-2">Add survey personnel to get started</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {surveyPersons.map((person) => (
                  <div key={person.id} className="p-5 border-2 border-slate-100 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-slate-200 transition-all duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-lg">{person.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 text-lg">{person.name}</div>
                          <div className="text-emerald-600 font-medium">{person.email}</div>
                          <div className="text-xs text-slate-500 mt-2 bg-white px-2 py-1 rounded">
                            Created: {new Date(person.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <span className="px-3 py-2 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-lg">
                        Survey Person
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-slate-100 border-b-2 border-slate-200 py-6">
            <CardTitle className="text-xl font-semibold text-slate-800">Survey Questions ({questions.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {questions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-slate-400">❓</span>
                </div>
                <p className="text-slate-500 font-medium text-lg">No questions yet</p>
                <p className="text-sm text-slate-400 mt-2">Create questions for your surveys</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {questions.map((question) => (
                  <div key={question.id} className="p-5 border-2 border-slate-100 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-slate-200 transition-all duration-200">
                    <div className="font-semibold text-slate-800 text-lg mb-3">{question.text}</div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-2 text-sm font-semibold rounded-lg ${
                        question.type === 'text' 
                          ? 'bg-violet-100 text-violet-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {question.type === 'text' ? 'Text Response' : 'Multiple Choice'}
                      </span>
                    </div>
                    {question.options && question.options.length > 0 && (
                      <div className="p-4 bg-white rounded-lg border-2 border-slate-100">
                        <span className="font-semibold text-slate-700 text-sm block mb-2">Answer Options:</span>
                        <div className="flex flex-wrap gap-2">
                          {question.options.map((option, index) => (
                            <span key={index} className="px-3 py-1 bg-slate-200 text-slate-700 text-sm rounded-full font-medium">
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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