import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom"
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import NotFound from "./Pages/NotFound"
import Game from "./Pages/Game"
import ProtectedRoute from "./Components/ProtectedRoute"
import Home from "./Pages/Home"
import CreateGame from "./Pages/CreateGame"
import JoinGame from "./Pages/JoinGame"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login"/>
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/game/:gameid" element={
          <ProtectedRoute>
            <Game />
          </ProtectedRoute>
        }/>
        <Route path="/newgame/" element={
          <ProtectedRoute>
            <CreateGame />
          </ProtectedRoute>
        }/>
        <Route path="/joingame/" element={
          <ProtectedRoute>
            <JoinGame />
          </ProtectedRoute>
        }/>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
    </BrowserRouter>
  )
}

export default App
