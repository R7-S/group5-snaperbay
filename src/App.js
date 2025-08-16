// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ImageDetail from "./pages/images/[id]";
import NotFounds from "./pages/NotFounds";
import PageTransition from "./components/ui/PageTransition";
import TopProgressBar from "./components/ui/TopProgressBar";
import FramerLikeBackground from "./components/ui/FramerLikeBackground";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence exitBeforeEnter>
      <Switch location={location} key={location.key || location.pathname}>
        <Route exact path="/">
          <PageTransition className="min-h-[60vh]">
            <Home />
          </PageTransition>
        </Route>
        <Route path="/about">
          <PageTransition>
            <About />
          </PageTransition>
        </Route>
        <Route path="/contact">
          <PageTransition>
            <Contact />
          </PageTransition>
        </Route>
        <Route path="/images/:id">
          <PageTransition>
            <ImageDetail />
          </PageTransition>
        </Route>
        <Route>
          <PageTransition>
            <NotFounds />
          </PageTransition>
        </Route>
      </Switch>
    </AnimatePresence>
  );
}

function AppShell() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="relative isolate bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      {/* Fixed, viewport-wide background under everything */}
      {isHome && (
        <FramerLikeBackground variant="auto" intensity={0.8} blur={85} />
      )}

      {/* content above aurora */}
      <div className="relative z-10">
        <Navbar />
        <AnimatedRoutes />
        <TopProgressBar offset={72} height={6} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}
