import { useState } from 'react'
import Navbar from "./component/Navbar";
import Home from "./component/Home";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Vote from './component/Vote';
import Result from './component/Result';
import AddCandidate from './component/AddCandidate';

function App() {

  const [route, setRoute] = useState("home");

  const onRouteChange = (route) => {
    if (route === "QuadB") {
      setRoute("home")
      return
    } 
    setRoute(route)
  }

  return (
    <div className="min-h-screen bg-gray-900 ">
      <ToastContainer className="mt-16"/>
      <div className="p-5 pt-8">
        <Navbar onRouteChange={onRouteChange} route={route} />
        {
          route === "home" ? (
            <Home onRouteChange={onRouteChange}/>
          ) : route === "vote" ? (
            <Vote />
          ) : route === "leaderboard" ? (
            <Result />
          ) : route === "addCandidate" ? (
            <AddCandidate />
          ) : <>
            <h1>Not found</h1>
          </>
        }
      </div>
    </div>
  )
}

export default App
