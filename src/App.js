import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/about"; // ⬅ import About page
import NotFounds from "./pages/NotFounds";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Navbar />

        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} /> {/* ⬅ New route */}
          <Route component={NotFounds} />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
