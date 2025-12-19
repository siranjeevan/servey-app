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

  const getProgress = () => {
    const totalQuestions = questions.length
    const answeredQuestions = Object.keys(answers).filter(key => answers[key] && answers[key].trim() !== '').length
    return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0
  }

  if (step === 'settings') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Survey Configuration</h1>
          <p className="text-gray-600">Please provide your location details to begin the survey</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">1</span>
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Configuration</span>
            </div>
            <div className="w-16 h-1 bg-gray-200 rounded"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-sm font-medium">2</span>
              </div>
              <span className="ml-2 text-sm text-gray-500">Survey</span>
            </div>
            <div className="w-16 h-1 bg-gray-200 rounded"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-sm font-medium">3</span>
              </div>
              <span className="ml-2 text-sm text-gray-500">Complete</span>
            </div>
          </div>
        </div>

        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader className="border-b border-gray-200 bg-gray-50">
            <CardTitle className="text-lg font-semibold text-gray-900">Location Information</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="constitution" className="block text-sm font-medium text-gray-700 mb-2">
                  Constitution Type <span className="text-red-500">*</span>
                </Label>
                <Select value={settings.constitution} onValueChange={(value) => setSettings({ ...settings, constitution: value })}>
                  <SelectTrigger className="w-full h-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <SelectValue placeholder="Select constitution type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urban">Urban</SelectItem>
                    <SelectItem value="rural">Rural</SelectItem>
                    <SelectItem value="semi-urban">Semi-Urban</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                  Area Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="area"
                  value={settings.area}
                  onChange={(e) => setSettings({ ...settings, area: e.target.value })}
                  placeholder="Enter your area or locality name"
                  className="w-full h-12 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <Label htmlFor="booth" className="block text-sm font-medium text-gray-700 mb-2">
                  Booth Number <span className="text-gray-400">(Optional)</span>
                </Label>
                <Input
                  id="booth"
                  value={settings.boothNumber}
                  onChange={(e) => setSettings({ ...settings, boothNumber: e.target.value })}
                  placeholder="Enter booth number if applicable"
                  className="w-full h-12 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <Button 
                onClick={handleSettingsSubmit} 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                disabled={!settings.constitution || !settings.area || isLoading}
              >
                {isLoading ? 'Preparing Survey...' : 'Continue to Survey'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 'survey') {
    if (questions.length === 0) {
      return (
        <div className="max-w-2xl mx-auto px-6 py-8">
          <Card className="bg-white shadow-lg border border-gray-200">
            <CardHeader className="border-b border-gray-200 bg-orange-50">
              <CardTitle className="text-lg font-semibold text-orange-800">Survey Not Available</CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions Available</h3>
              <p className="text-gray-600 mb-6">
                Your administrator hasn't created any survey questions yet. Please contact your administrator or try again later.
              </p>
              <Button 
                onClick={resetSurvey}
                className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-2 rounded-md transition-colors"
              >
                Return to Configuration
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Survey Questions</h1>
            <p className="text-gray-600">Please answer all questions to complete the survey</p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="ml-2 text-sm font-medium text-green-600">Configuration</span>
              </div>
              <div className="w-16 h-1 bg-green-600 rounded"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">2</span>
                </div>
                <span className="ml-2 text-sm font-medium text-blue-600">Survey</span>
              </div>
              <div className="w-16 h-1 bg-gray-200 rounded"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm font-medium">3</span>
                </div>
                <span className="ml-2 text-sm text-gray-500">Complete</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-600">
              {Object.keys(answers).filter(key => answers[key] && answers[key].trim() !== '').length} of {questions.length} questions answered
            </p>
          </div>

          {/* Location Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-center space-x-6 text-sm">
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                <span className="text-gray-700">Constitution: <span className="font-medium text-blue-700">{settings.constitution}</span></span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                <span className="text-gray-700">Area: <span className="font-medium text-blue-700">{settings.area}</span></span>
              </span>
              {settings.boothNumber && (
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span className="text-gray-700">Booth: <span className="font-medium text-blue-700">{settings.boothNumber}</span></span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {questions.map((question, index) => (
            <Card key={question.id} className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <Label className="text-base font-medium text-gray-900 mb-4 block">
                      {question.text}
                    </Label>
                    {question.type === 'text' ? (
                      <Textarea
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        placeholder="Please provide your detailed response here..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      />
                    ) : (
                      <Select 
                        value={answers[question.id] || ''} 
                        onValueChange={(value) => handleAnswerChange(question.id, value)}
                      >
                        <SelectTrigger className="w-full h-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <SelectValue placeholder="Please select your answer" />
                        </SelectTrigger>
                        <SelectContent>
                          {question.options.map((option) => (
                            <SelectItem key={option} value={option} className="py-3">
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={resetSurvey} 
            className="flex-1 h-12 border-2 border-gray-300 hover:bg-gray-50 font-medium text-gray-700 rounded-md transition-colors"
          >
            Start Over
          </Button>
          <Button 
            onClick={handleSurveySubmit} 
            className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            disabled={isLoading || getProgress() < 100}
          >
            {isLoading ? 'Submitting Survey...' : 'Submit Survey'}
          </Button>
        </div>
      </div>
    )
  }

  if (step === 'completed') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Configuration</span>
            </div>
            <div className="w-16 h-1 bg-green-600 rounded"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Survey</span>
            </div>
            <div className="w-16 h-1 bg-green-600 rounded"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Complete</span>
            </div>
          </div>
        </div>

        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader className="border-b border-gray-200 bg-green-50 text-center">
            <CardTitle className="text-xl font-semibold text-green-800">Survey Completed Successfully</CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-green-600 text-3xl">✓</span>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
            <p className="text-gray-600 mb-8">
              Your survey responses have been successfully submitted and recorded in our system.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Submission Details</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Submission Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Submission Time:</span>
                  <span className="font-medium">{new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                {location && (
                  <div className="flex items-center justify-between">
                    <span>Location:</span>
                    <span className="font-medium">{location.latitude}, {location.longitude}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Questions Answered:</span>
                  <span className="font-medium">{questions.length}</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={resetSurvey} 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Take Another Survey
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
}