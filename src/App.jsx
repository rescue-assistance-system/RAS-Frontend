import { useState } from 'react';
// import LoginPage from './pages/Login';
import Header from './components/common/Header';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <LoginPage /> */}
      <Header />
    </>
  );
}

export default App;
