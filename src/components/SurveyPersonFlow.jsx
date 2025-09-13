import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from './AuthProvider'

export default function SurveyPersonFlow() {
  const { currentUser, getClientQuestions, submitSurvey } = useAuth()
  const [step, setStep] = useState('settings')
  const [settings, setSettings] = useState({
    constitution: '',
    area: '',
    boothNumber: ''
  })
  const [answers, setAnswers] = useState({})
  const [location, setLocation] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const questions = getClientQuestions(currentUser.clientId)

  const getLocation = () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
            setLocation(loc)
            resolve(loc)
          },
          () => {
            const loc = { latitude: 'N/A', longitude: 'N/A' }
            setLocation(loc)
            resolve(loc)
          }
        )
      } else {
        const loc = { latitude: 'N/A', longitude: 'N/A' }
        setLocation(loc)
        resolve(loc)
      }
    })
  }

  const handleSettingsSubmit = async () => {
    if (settings.constitution && settings.area) {
      setIsLoading(true)
      await getLocation()
      setIsLoading(false)
      setStep('survey')
    }
  }

  const handleAnswerChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value })
  }

  const handleSurveySubmit = async () => {
    setIsLoading(true)
    
    const submission = {
      settings,
      answers,
      location,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    }
    
    try {
      submitSurvey(submission)
      setStep('completed')
    } finally {
      setIsLoading(false)
    }
  }

  const resetSurvey = () => {
    setStep('settings')
    setAnswers({})
    setSettings({ constitution: '', area: '', boothNumber: '' })
    setLocation(null)
  }

  if (step === 'settings') {
    return (
      <div className="p-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-2">
            Survey Configuration
          </h2>
          <p className="text-slate-600 text-lg">Please configure your survey settings to begin</p>
          <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <Card className="max-w-lg mx-auto shadow-2xl border-0 bg-white">
          <CardHeader className="bg-indigo-600 text-white py-8">
            <CardTitle className="text-2xl font-semibold text-center">Required Information</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="constitution" className="text-slate-700 font-semibold text-sm uppercase tracking-wide">Constitution Type *</Label>
              <Select value={settings.constitution} onValueChange={(value) => setSettings({ ...settings, constitution: value })}>
                <SelectTrigger className="h-12 border-2 border-slate-200 focus:border-indigo-500 rounded-lg">
                  <SelectValue placeholder="Select constitution type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urban">Urban Area</SelectItem>
                  <SelectItem value="rural">Rural Area</SelectItem>
                  <SelectItem value="semi-urban">Semi-Urban Area</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="area" className="text-slate-700 font-semibold text-sm uppercase tracking-wide">Area Name *</Label>
              <Input
                id="area"
                value={settings.area}
                onChange={(e) => setSettings({ ...settings, area: e.target.value })}
                placeholder="Enter your area or locality name"
                className="h-12 border-2 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="booth" className="text-slate-700 font-semibold text-sm uppercase tracking-wide">Booth Number <span className="text-slate-400">(Optional)</span></Label>
              <Input
                id="booth"
                value={settings.boothNumber}
                onChange={(e) => setSettings({ ...settings, boothNumber: e.target.value })}
                placeholder="Enter booth number if applicable"
                className="h-12 border-2 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
              />
            </div>
            
            <Button 
              onClick={handleSettingsSubmit} 
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 mt-8"
              disabled={!settings.constitution || !settings.area || isLoading}
            >
              {isLoading ? 'Preparing Survey...' : 'Begin Survey'}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 'survey') {
    if (questions.length === 0) {
      return (
        <div className="p-8">
          <Card className="max-w-lg mx-auto shadow-2xl border-0 bg-white">
            <CardHeader className="bg-amber-500 text-white py-8">
              <CardTitle className="text-2xl font-semibold text-center">No Questions Available</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6 p-8">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl text-amber-600">⚠</span>
              </div>
              <div>
                <p className="text-slate-600 text-lg font-medium">Survey Not Ready</p>
                <p className="text-slate-500 mt-2">Your administrator hasn't created any survey questions yet.</p>
              </div>
              <Button 
                onClick={resetSurvey}
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-lg"
              >
                Return to Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-slate-800 mb-2">
            Survey Questions
          </h2>
          <div className="mt-6 p-6 bg-white rounded-xl shadow-lg border-2 border-slate-100 max-w-2xl mx-auto">
            <div className="text-sm font-semibold text-slate-700 space-y-1">
              <div className="flex items-center justify-center space-x-6">
                <span className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <span>Constitution: <span className="text-indigo-600">{settings.constitution}</span></span>
                </span>
                <span className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span>Area: <span className="text-emerald-600">{settings.area}</span></span>
                </span>
                {settings.boothNumber && (
                  <span className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                    <span>Booth: <span className="text-violet-600">{settings.boothNumber}</span></span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white">
          <CardHeader className="bg-slate-800 text-white py-8">
            <CardTitle className="text-2xl font-semibold text-center">
              Please Complete All Questions ({questions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {questions.map((question, index) => (
              <div key={question.id} className="p-6 border-2 border-slate-100 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-slate-200 transition-all duration-200">
                <Label className="text-lg font-semibold text-slate-800 mb-4 block">
                  <div className="flex items-start space-x-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="flex-1">{question.text}</span>
                  </div>
                </Label>
                {question.type === 'text' ? (
                  <Textarea
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Please provide your detailed response here..."
                    rows={4}
                    className="mt-4 border-2 border-slate-200 focus:border-slate-400 focus:ring-slate-400 rounded-lg resize-none text-base"
                  />
                ) : (
                  <Select 
                    value={answers[question.id] || ''} 
                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                  >
                    <SelectTrigger className="mt-4 h-12 border-2 border-slate-200 focus:border-slate-400 rounded-lg text-base">
                      <SelectValue placeholder="Please select your answer" />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options.map((option) => (
                        <SelectItem key={option} value={option} className="text-base py-3">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
            
            <div className="flex gap-6 pt-8">
              <Button 
                variant="outline" 
                onClick={resetSurvey} 
                className="flex-1 h-12 border-2 border-slate-300 hover:bg-slate-100 hover:border-slate-400 font-semibold text-slate-700 rounded-lg"
              >
                Start Over
              </Button>
              <Button 
                onClick={handleSurveySubmit} 
                className="flex-1 h-12 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting Survey...' : 'Submit Survey'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 'completed') {
    return (
      <div className="p-8">
        <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-white">
          <CardHeader className="bg-emerald-600 text-white py-8 text-center">
            <CardTitle className="text-3xl font-bold">
              Survey Completed Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-8 p-12">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl text-emerald-600">✓</span>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-slate-800">Thank You!</h3>
              <p className="text-slate-600 text-lg">Your responses have been successfully recorded and submitted.</p>
            </div>
            
            <div className="p-6 bg-slate-50 rounded-xl border-2 border-slate-100">
              <h4 className="font-semibold text-slate-800 mb-3">Submission Details</h4>
              <div className="text-sm text-slate-600 space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  <span>Submitted: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</span>
                </div>
                {location && (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    <span>Location: {location.latitude}, {location.longitude}</span>
                  </div>
                )}
              </div>
            </div>
            
            <Button 
              onClick={resetSurvey} 
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Take Another Survey
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
}