import './App.css';
import { Routes, Route } from 'react-router-dom'
import Header from './components/header'
import Login from './components/login/login'
import SignUp from './components/login/registration'
import Dashboard from './components/dashboard/dashboard'

function hasJWT() {
  let flag = false;
  //check user has JWT token
  const loggedUser: any = localStorage.getItem("user")
  if (loggedUser) {
    let base64Url = JSON.parse(loggedUser).token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    let tokenExp = new Date(JSON.parse(jsonPayload).exp * 1000)
    let dateNow = new Date();
    tokenExp < dateNow ? flag = false : flag = true
    console.log(tokenExp)

  } else {
    flag = false
  }
  return flag
}

function App() {

  return (
    <div >
      <Header />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        {hasJWT() ? <Route path='/dashboard' element={<Dashboard />} /> : ''}
      </Routes>
    </div>
  );
}

export default App;
