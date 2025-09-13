import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([
    { id: 1, email: 'superadmin@survey.com', role: 'super-admin', name: 'Super Admin' }
  ])
  const [clients, setClients] = useState([])
  const [surveyPersons, setSurveyPersons] = useState([])
  const [questions, setQuestions] = useState([])
  const [submissions, setSubmissions] = useState([])

  const login = (email) => {
    const user = users.find(u => u.email === email)
    if (user) {
      setCurrentUser(user)
      return true
    }
    return false
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const addClient = (clientData) => {
    const newClient = {
      ...clientData,
      id: Date.now(),
      role: 'client-admin',
      createdAt: new Date().toISOString()
    }
    setClients(prev => [...prev, newClient])
    setUsers(prev => [...prev, newClient])
    return newClient
  }

  const addSurveyPerson = (personData, clientId) => {
    const newPerson = {
      ...personData,
      id: Date.now(),
      role: 'survey-person',
      clientId,
      createdAt: new Date().toISOString()
    }
    setSurveyPersons(prev => [...prev, newPerson])
    setUsers(prev => [...prev, newPerson])
    return newPerson
  }

  const addQuestion = (questionData, clientId) => {
    const newQuestion = {
      ...questionData,
      id: Date.now(),
      clientId,
      createdAt: new Date().toISOString()
    }
    setQuestions(prev => [...prev, newQuestion])
    return newQuestion
  }

  const submitSurvey = (surveyData) => {
    const submission = {
      ...surveyData,
      id: Date.now(),
      userId: currentUser.id,
      clientId: currentUser.clientId,
      submittedAt: new Date().toISOString()
    }
    setSubmissions(prev => [...prev, submission])
    return submission
  }

  const getClientQuestions = (clientId) => {
    return questions.filter(q => q.clientId === clientId)
  }

  const getClientSurveyPersons = (clientId) => {
    return surveyPersons.filter(p => p.clientId === clientId)
  }

  const value = {
    currentUser,
    users,
    clients,
    surveyPersons,
    questions,
    submissions,
    login,
    logout,
    addClient,
    addSurveyPerson,
    addQuestion,
    submitSurvey,
    getClientQuestions,
    getClientSurveyPersons
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}