import "./App.css";
import Board from "./Board";
import { Route, Routes, useNavigate } from "react-router-dom";
import Form from "./Form";
import { useState } from "react";
function App() {
  const Navigate = useNavigate()
  const [params, setParms] = useState();
  function startGame(e) {
    setParms(e.target.closest("form").difficulty.value)
    Navigate("/play");
  }
  return (
    <>
    <header>
      <h1>Cherry Sweeper</h1>
    </header>
    <main>
      <Routes>
        <Route path="/" element={<Form startGame={startGame} />} />
        <Route path="/play" element={<Board params={params}/>} />
      </Routes>
    </main>
    </>
  );
}

export default App;
