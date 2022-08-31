import './App.css';
import {Routes, Route} from 'react-router-dom'
import Header from './components/header'
import Login from './components/login/login'
import SignUp from './components/login/registration'

function App() {
  return (
    <div >
      <Header/>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
