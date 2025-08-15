import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import NotFounds from "./pages/NotFounds";
import Layout from "./components/Layout"; 

function App() {
  return (
    <Router>
      <Layout>
        
        <Navbar />

        <Switch>
          <Route exact path="/" component={Home} />
          <Route component={NotFounds} />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
