import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/about";        // ✅ case-correct
import NotFounds from "./pages/NotFounds";
import Layout from "./components/Layout";
import Contact from "./pages/Contact";    // ✅ import OK

function App() {
  return (
    <Router>
      <Layout>
        <Navbar />

        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <Route exact path="/contact" component={Contact} /> {/* ✅ lowercase route */}
          {/* Catch-all 404 */}
          <Route component={NotFounds} />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
