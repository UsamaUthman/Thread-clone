import React , {useState} from 'react'
import SignupCard from '../components/SignupCard'
import LoginCard from '../components/LoginCard'

function AuthPage() {
    const [showLogin, setShowLogin] = useState(true)
  return (
    <div>
        {showLogin ? <LoginCard setShowLogin={setShowLogin} /> : <SignupCard setShowLogin={setShowLogin} />}
    </div>
  )
}

export default AuthPage