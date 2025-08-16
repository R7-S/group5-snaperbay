// Contributors: Rahul Sasidharan Nair ,8992754
//Contributors: Bhumil Parate , 8994642

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
import Footer from "./components/Footer";

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
  return (
    <div className="relative isolate bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      {/* Light theme background */}
      <div className="dark:hidden">
        <FramerLikeBackground variant="light" intensity={0.65} blur={85} />
      </div>

      {/* Dark theme background */}
      <div className="hidden dark:block">
        <FramerLikeBackground variant="dark" intensity={0.9} blur={85} />
      </div>

      <div className="relative z-10">
        <Navbar />
        <AnimatedRoutes />
        <Footer />
        <TopProgressBar />
      </div>
    </div>
  );
}

export default function App() {
  return <AppShell />;
}
