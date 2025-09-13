import AuthProvider from './components/AuthProvider'
import SurveyApp from './components/SurveyApp'

function App() {
  return (
    <AuthProvider>
      <SurveyApp />
    </AuthProvider>
  )
}

export default App
