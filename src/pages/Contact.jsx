// src/pages/Contact.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin,
  Loader2, Send, X, CheckCircle2, MessageSquare, CalendarClock, Paperclip
} from "lucide-react";
import { useHistory } from "react-router-dom"; // v5 navigation
import { FiCheck, FiX, FiMail, FiPhone, FiTag, FiMapPin, FiPaperclip, FiUser, FiRadio } from "react-icons/fi";

const FORMSPREE_ENDPOINT = process.env.REACT_APP_FORMSPREE_ENDPOINT || "";

export default function Contact() {
  const history = useHistory();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "General",
    topicDetails: "",
    country: "",
    city: "",
    contactMethod: "Email",
    bestTime: "Anytime",
    newsletter: false,
    files: [],
    // honeypot:
    nickname: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [showSummary, setShowSummary] = useState(false);

  const modalCloseBtnRef = useRef(null);

  const topicPlaceholders = {
    General: "Please describe your general inquiry...",
    Partnership: "Tell us about your partnership idea (goals, scope, links)...",
    Support: "Explain the issue or assistance you need (device, steps tried)...",
    Feedback: "Share your feedback or suggestions (what to improve, why)...",
    Copyright: "Describe the content and your concern (links, details)...",
  };

  const topicLabelByType = {
    General: "Details about your inquiry",
    Partnership: "Partnership details",
    Support: "Support details",
    Feedback: "Feedback details",
    Copyright: "Copyright details",
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.email.trim()) e.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Please enter a valid email.";
    if (!form.topicDetails.trim() || form.topicDetails.trim().length < 5)
      e.topicDetails = "Please provide more details about your topic.";
    if (form.phone && !/^\+?[0-9 ()-]{7,}$/.test(form.phone))
      e.phone = "Enter a valid phone number (digits, +, (), - allowed).";
    if (!form.country.trim()) e.country = "Please select your country.";
    if (!form.contactMethod) e.contactMethod = "Choose a contact method.";
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
    } else if (type === "file") {
      setForm((f) => ({ ...f, files: Array.from(files || []) }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    // Honeypot
    if (form.nickname) {
      setStatus({ type: "error", message: "Submission blocked." });
      return;
    }

    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) return;

    setSubmitting(true);
    try {
      if (FORMSPREE_ENDPOINT) {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            files: form.files.map((f) => f.name), // send names only
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        await new Promise((r) => setTimeout(r, 800)); // simulate success
      }

      setStatus({
        type: "success",
        message: "Thanks! Your message has been sent.",
      });
      setShowSummary(true);
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message:
          "Something went wrong while sending your message. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Focus the close button when modal opens
  useEffect(() => {
    if (showSummary && modalCloseBtnRef.current) {
      modalCloseBtnRef.current.focus();
    }
  }, [showSummary]);

  const inputBase =
    "w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition";

  const clearForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      topic: "General",
      topicDetails: "",
      country: "",
      city: "",
      contactMethod: "Email",
      bestTime: "Anytime",
      newsletter: false,
      files: [],
      nickname: "",
    });
    setErrors({});
    setStatus({ type: "", message: "" });
  };

  // Close modal + go home
  const closeAndGoHome = (reset = false) => {
    setShowSummary(false);
    if (reset) clearForm();
    history.push("/"); // v5 navigate home
  };

  // ==== Animation presets for rows ====
  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-start px-6 py-12 bg-white dark:bg-black">
      {/* Title */}
      <motion.h1
        className="text-4xl font-bold mb-3 text-gray-800 dark:text-white text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Contact <span className="text-blue-500">Snapper Bay</span>
      </motion.h1>
      <p className="text-gray-600 dark:text-gray-300 mb-10 text-center max-w-2xl">
        Questions, feedback, or collaborations? Drop us a line—we’d love to hear from you.
      </p>

      {/* Status banner */}
      {status.message && (
        <div
          role="status"
          className={`mb-8 w-full max-w-6xl rounded-xl px-4 py-3 text-sm ${
            status.type === "success"
              ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300 border border-green-200 dark:border-green-900"
              : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300 border border-red-200 dark:border-red-900"
          }`}
        >
          {status.message}
        </div>
      )}

      {/* Two-column layout */}
      <div className="w-full max-w-6xl grid gap-8 md:grid-cols-2">
        {/* Left: Contact details + Map */}
        <motion.div
          className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur p-6 shadow"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-blue-500">Get in touch</h2>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div className="flex items-start gap-3">
              <Mail className="mt-1" size={20} />
              <div>
                <p className="font-medium">Email</p>
                <a href="mailto:info@snapperbay.com" className="text-blue-600 dark:text-blue-400 underline-offset-2 hover:underline">
                  info@snapperbay.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-1" size={20} />
              <div>
                <p className="font-medium">Phone</p>
                <a href="tel:+11234567890" className="text-blue-600 dark:text-blue-400 underline-offset-2 hover:underline">
                  +1 (123) 456-7890
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-1" size={20} />
              <div>
                <p className="font-medium">Address</p>
                <p>
                  299 Doon Valley Dr, Kitchener, ON N2G 4M4, Canada
                  <br />
                  <span className="text-sm opacity-70">(Conestoga College - Doon Campus)</span>
                </p>
              </div>
            </div>

            <div className="pt-2">
              <p className="font-medium mb-2">Follow us</p>
              <div className="flex gap-4 text-blue-500">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={22} /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={22} /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><Twitter size={22} /></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={22} /></a>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-6 overflow-hidden rounded-xl shadow">
            <iframe
              title="Conestoga College Doon Campus Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.803349486515!2d-80.51623268450195!3d43.42384397913325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882bf2e8f19c3b77%3A0x7e02984f2d1b3f1d!2sConestoga%20College%20Doon%20Campus!5e0!3m2!1sen!2sca!4v1692119301234!5m2!1sen!2sca"
              width="100%"
              height="260"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </motion.div>

        {/* Right: Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur p-6 shadow"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          noValidate
        >
          {/* Honeypot */}
          <input type="text" name="nickname" value={form.nickname} onChange={handleChange} className="hidden" tabIndex={-1} autoComplete="off" />

          <h2 className="text-2xl font-semibold mb-4 text-blue-500">Send a message</h2>

          {/* Row 1 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block mb-1 text-sm">Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} className={inputBase} placeholder="Your full name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined}/>
              {errors.name && <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 text-sm">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className={inputBase} placeholder="you@example.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined}/>
              {errors.email && <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <div>
              <label htmlFor="phone" className="block mb-1 text-sm">Phone (optional)</label>
              <input id="phone" name="phone" value={form.phone} onChange={handleChange} className={inputBase} placeholder="+1 (555) 123-4567" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined}/>
              {errors.phone && <p id="phone-error" className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="country" className="block mb-1 text-sm">Country</label>
              <input id="country" name="country" value={form.country} onChange={handleChange} className={inputBase} placeholder="Canada" aria-invalid={!!errors.country} aria-describedby={errors.country ? "country-error" : undefined}/>
              {errors.country && <p id="country-error" className="mt-1 text-sm text-red-600">{errors.country}</p>}
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <div>
              <label htmlFor="city" className="block mb-1 text-sm">City (optional)</label>
              <input id="city" name="city" value={form.city} onChange={handleChange} className={inputBase} placeholder="Kitchener"/>
            </div>
            <div>
              <label htmlFor="topic" className="block mb-1 text-sm">Topic</label>
              <select id="topic" name="topic" value={form.topic} onChange={handleChange} className={inputBase}>
                <option>General</option>
                <option>Partnership</option>
                <option>Support</option>
                <option>Feedback</option>
                <option>Copyright</option>
              </select>
            </div>
          </div>

          {/* Row 4: Dynamic Topic Details */}
          <div className="mt-4">
            <label htmlFor="topicDetails" className="block mb-1 text-sm">
              {topicLabelByType[form.topic]}
            </label>
            <textarea
              id="topicDetails"
              name="topicDetails"
              value={form.topicDetails}
              onChange={handleChange}
              placeholder={topicPlaceholders[form.topic]}
              className={`${inputBase} h-24`}
              aria-invalid={!!errors.topicDetails}
              aria-describedby={errors.topicDetails ? "topicDetails-error" : undefined}
            />
            {errors.topicDetails && (
              <p id="topicDetails-error" className="mt-1 text-sm text-red-600">
                {errors.topicDetails}
              </p>
            )}
          </div>

          {/* Row 5: Contact prefs */}
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <div>
              <span className="block mb-1 text-sm">Preferred Contact</span>
              <div className="flex gap-4">
                {["Email", "Phone"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="contactMethod"
                      value={opt}
                      checked={form.contactMethod === opt}
                      onChange={handleChange}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {errors.contactMethod && <p className="mt-1 text-sm text-red-600">{errors.contactMethod}</p>}
            </div>

            <div>
              <label htmlFor="bestTime" className="block mb-1 text-sm">Best Time to Reach</label>
              <select id="bestTime" name="bestTime" value={form.bestTime} onChange={handleChange} className={inputBase}>
                <option>Anytime</option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
              </select>
            </div>
          </div>

          {/* Files + Newsletter */}
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <div>
              <label htmlFor="files" className="block mb-1 text-sm">Attachments (optional)</label>
              <input id="files" name="files" type="file" multiple onChange={handleChange} className="block w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-2 file:px-3 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"/>
              {form.files?.length > 0 && (
                <p className="mt-1 text-xs opacity-70">
                  {form.files.length} file(s): {form.files.map((f) => f.name).join(", ")}
                </p>
              )}
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="newsletter" checked={form.newsletter} onChange={handleChange} />
                <span className="text-sm">Subscribe to newsletter</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-5 py-3 font-medium hover:bg-blue-700 disabled:opacity-60 transition shadow"
            >
              {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              {submitting ? "Sending..." : "Send message"}
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="rounded-full border border-neutral-300 dark:border-neutral-700 px-5 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              Reset
            </button>
          </div>

          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            By submitting, you agree to our terms and acknowledge our privacy policy.
          </p>
        </motion.form>
      </div>

      {/* Summary Modal — Modern, centered, 70% & scrollable */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            aria-hidden={!showSummary}
          >
            {/* Backdrop (click → close & home) */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => closeAndGoHome(false)}
            />

            {/* Dialog wrapper (70% width & height, centered) */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-summary-title"
              className="relative z-[61] w-[70vw] h-[70vh] max-w-6xl overflow-hidden rounded-3xl border border-neutral-200/70 dark:border-neutral-800/70 shadow-[0_20px_80px_rgba(0,0,0,0.35)] bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 22 } }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
            >
              {/* Header with gradient */}
              <div className="relative">
                <div className="h-24 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
                {/* Badge */}
                <motion.div
                  className="absolute -bottom-7 left-6 inline-flex items-center gap-2 rounded-full bg-white/90 dark:bg-neutral-900/90 border border-neutral-200/70 dark:border-neutral-800/70 px-4 py-2 shadow-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
                >
                  <CheckCircle2 className="text-emerald-500" size={18} />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Submission Summary</span>
                </motion.div>

                {/* Close (X) */}
                <button
                  ref={modalCloseBtnRef}
                  onClick={() => closeAndGoHome(false)}
                  className="absolute right-3 top-3 p-2 rounded-full bg-white/85 dark:bg-neutral-900/85 border border-neutral-200 dark:border-neutral-800 hover:bg-white dark:hover:bg-neutral-800 transition"
                  aria-label="Close summary"
                >
                  <FiX className="opacity-80" />
                </button>
              </div>

              {/* Scrollable Body (max-height) */}
              <div className="px-6 pt-12 pb-24 h-[calc(70vh-4rem)] overflow-y-auto">
                <motion.div
                  className="grid gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  <SummaryRow icon={<FiUser />} label="Name" value={form.name} variants={itemVariants} />
                  <SummaryRow icon={<FiMail />} label="Email" value={form.email} variants={itemVariants} />
                  <SummaryRow icon={<FiPhone />} label="Phone" value={form.phone || "—"} variants={itemVariants} />
                  <SummaryRow
                    icon={<FiMapPin />}
                    label="Country / City"
                    value={`${form.country}${form.city ? ` · ${form.city}` : ""}`}
                    variants={itemVariants}
                  />
                  <SummaryRow icon={<FiTag />} label="Topic" value={form.topic} variants={itemVariants} />

                  {/* Topic Details */}
                  <motion.div
                    variants={itemVariants}
                    className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white/70 dark:bg-neutral-900/70"
                  >
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                      <MessageSquare size={14} />
                      {topicLabelByType[form.topic]}
                    </div>
                    <div className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                      {form.topicDetails || "—"}
                    </div>
                  </motion.div>

                  <SummaryRow icon={<FiRadio />} label="Preferred Contact" value={form.contactMethod} variants={itemVariants} />
                  <SummaryRow icon={<CalendarClock size={16} />} label="Best Time" value={form.bestTime} variants={itemVariants} />

                  <SummaryRow
                    icon={<FiPaperclip />}
                    label="Attachments"
                    value={form.files?.length ? form.files.map((f) => f.name).join(", ") : "None"}
                    variants={itemVariants}
                  />

                  <SummaryRow
                    icon={<CalendarClock size={16} />}
                    label="Newsletter"
                    value={form.newsletter ? "Yes" : "No"}
                    variants={itemVariants}
                  />
                </motion.div>
              </div>

              {/* Sticky Footer */}
              <div className="absolute bottom-0 left-0 right-0 bg-white/85 dark:bg-neutral-900/85 border-t border-neutral-200/70 dark:border-neutral-800/70 px-6 py-4 flex justify-end gap-2 backdrop-blur">
                <button
                  onClick={() => closeAndGoHome(false)} // Close → home
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-700 px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-sm font-medium"
                >
                  <X size={16} />
                  Close
                </button>
                <button
                  onClick={() => closeAndGoHome(true)} // Done → reset + home
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition text-sm font-medium shadow"
                >
                  <FiCheck />
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Icon-led summary row */
function SummaryRow({ icon, label, value, variants }) {
  return (
    <motion.div
      variants={variants}
      className="flex items-start gap-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white/70 dark:bg-neutral-900/70"
    >
      <div className="mt-0.5 shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80">
        <span className="opacity-80 text-sm">{icon}</span>
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</div>
        <div className="text-sm text-gray-900 dark:text-gray-100 break-words">{value}</div>
      </div>
    </motion.div>
  );
}
