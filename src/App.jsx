import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import VoipClient from "./VoipClient";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user/:user" element={<VoipClient />} />
      </Routes>
    </Router>
  );
}

export default App;
