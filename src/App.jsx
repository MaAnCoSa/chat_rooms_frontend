import { BrowserRouter, Routes, Route } from 'react-router-dom';


import { Register } from './pages/register.jsx';
import { Login } from './pages/login.jsx';
import { Home } from './pages/home.jsx';
import { Lobby } from './pages/lobby.jsx';
import { Layout } from './pages/layout.jsx';




export const App = () => {
  return (
    <div className="App"
    style={{
      height: "100%",
      width: "100%",
      backgroundColor: "#191629"
    }}>
      <BrowserRouter>
        <Routes>
          <Route Path="/" element={<Layout />} >
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/home" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
