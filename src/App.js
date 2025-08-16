// src/App.js
// Contributors: <Your Name> (routing clean-up, animations)

import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ImageDetail from "./pages/images/[id]";
import PageTransition from "./components/ui/PageTransition";
import TopProgressBar from "./components/ui/TopProgressBar";
import FramerLikeBackground from "./components/ui/FramerLikeBackground";
import About from "./pages/about";
import NotFounds from "./pages/NotFounds";
import Contact from "./pages/Contact";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
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
      {isHome && <FramerLikeBackground variant="auto" intensity={0.8} blur={85} />}

      <div className="relative z-10">
        <Navbar />
        <AnimatedRoutes />
        <TopProgressBar />
      </div>
    </div>
  );
}

export default function App() {
  return <AppShell />;
}
