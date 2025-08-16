// src/pages/about.jsx
// Contributors: <Your Name> (About page, slideshow, API refactor)

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, Eye, Download, Users, Globe, Star, Heart, Trophy, Lightbulb,
  Facebook, Instagram, Twitter, Linkedin
} from "lucide-react";
import { fetchLatestImages } from "../api/image";

export default function About() {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchLatestImages();
        setImages((data || []).slice(0, 6).map(hit => hit.largeImageURL));
      } catch (err) {
        console.error("Error fetching images:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [images]);

  const cards = [
    { icon: <Users size={24} className="text-blue-500 mx-auto" />, title: "Founded", text: "SnaperBay was founded in 2025 with a mission to make stunning photography accessible worldwide." },
    { icon: <Globe size={24} className="text-green-500 mx-auto" />, title: "Global Community", text: "Connect with photographers and photography lovers from around the world and share your inspiration." },
    { icon: <Camera size={24} className="text-purple-500 mx-auto" />, title: "Our Vision", text: "Inspire creativity and showcase the beauty of the world through high-quality photography." },
    { icon: <Eye size={24} className="text-yellow-500 mx-auto" />, title: "Explore", text: "Browse trending images, explore categories, and find unique photos that spark your creativity." },
    { icon: <Download size={24} className="text-red-500 mx-auto" />, title: "Share & Download", text: "Easily share or download your favorite images for inspiration and personal projects." },
    { icon: <Star size={24} className="text-indigo-500 mx-auto" />, title: "Curated Content", text: "All images are carefully selected for quality and creativity, providing an inspiring experience." },
    { icon: <Heart size={24} className="text-pink-500 mx-auto" />, title: "Favorites", text: "Save your favorite images to revisit them anytime and create your personal gallery." },
    { icon: <Trophy size={24} className="text-orange-500 mx-auto" />, title: "Photographer Recognition", text: "Highlight talented photographers and celebrate outstanding work in the photography community." },
    { icon: <Lightbulb size={24} className="text-teal-500 mx-auto" />, title: "Inspiration", text: "Whether you’re a professional or hobbyist, find new ideas and perspectives to fuel your creativity." }
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-start px-6 py-12 text-center bg-white dark:bg-black">
      <motion.h1 className="text-4xl font-bold mb-12 text-gray-800 dark:text-white" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        About <span className="text-blue-500">SnaperBay</span>
      </motion.h1>

      <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mb-12">
        <motion.div className="flex-1 text-left" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <h2 className="text-2xl font-semibold mb-2 text-blue-500">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            SnaperBay is a curated platform for discovering stunning photography from talented creators worldwide. We aim to inspire creativity and provide a space where photographers and enthusiasts can connect.
          </p>
          <h2 className="text-2xl font-semibold mb-2 text-blue-500">Explore & Share</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Explore trending photos, diverse categories, and unique visuals that spark your imagination. Save your favorites, share with friends, and use images for personal projects with ease.
          </p>
          <h2 className="text-2xl font-semibold mb-2 text-blue-500">Community & Inspiration</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Join a global community of photography lovers. Learn, share, and celebrate creative excellence while discovering new perspectives from photographers around the world.
          </p>
        </motion.div>

        <div className="flex-1 w-full h-64 relative rounded-xl overflow-hidden shadow-lg">
          {images.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                src={images[current]}
                alt={`Slide ${current + 1}`}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 1 }}
                className="absolute w-full h-full object-cover rounded-xl"
              />
            </AnimatePresence>
          )}
        </div>
      </div>

      <div className="max-w-7xl w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        {cards.map((card, index) => (
          <motion.div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex flex-col gap-3" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
            {card.icon}
            <h2 className="text-xl font-semibold">{card.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">{card.text}</p>
          </motion.div>
        ))}
      </div>

      <motion.div className="max-w-5xl w-full flex flex-col md:flex-row items-start gap-6 mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
        <div className="flex-1 text-left text-gray-700 dark:text-gray-300">
          <h2 className="text-2xl font-semibold mb-3 text-blue-500">Contact Us</h2>
          <p className="mb-2">Email: info@SnaperBay.com</p>
          <p className="mb-2">Phone: +1 (123) 456-7890</p>
          <p className="mb-2">Address: 299 Doon Valley Dr, Kitchener, ON N2G 4M4, Canada (Conestoga College - Doon Campus)</p>
          <div className="flex gap-4 mt-3 text-blue-500">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><Facebook size={24} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><Instagram size={24} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><Twitter size={24} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><Linkedin size={24} /></a>
          </div>
        </div>
        <div className="flex-1">
          <iframe
            title="Conestoga College Doon Campus Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.803349486515!2d-80.51623268450195!3d43.42384397913325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882bf2e8f19c3b77%3A0x7e02984f2d1b3f1d!2sConestoga%20College%20Doon%20Campus!5e0!3m2!1sen!2sca!4v1692119301234!5m2!1sen!2sca"
            width="100%"
            height="250"
            className="border-0"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </motion.div>
    </div>
  );
}
