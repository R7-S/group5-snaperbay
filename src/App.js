import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import NotFounds from "./pages/NotFounds";

function App() {
  return (
    <Router>
      <div className="bg-white dark:bg-gray-800 min-h-screen text-gray-900 dark:text-white">
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          
  
          <Route component={NotFounds} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
