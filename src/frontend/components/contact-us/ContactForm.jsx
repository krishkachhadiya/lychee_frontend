"use client";

import { useEffect, useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function BalancedContactPage() {
  const recaptchaRef = useRef(null);

  // --- State for Contact Info API ---
  const [settings, setSettings] = useState(null);
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);

  // --- State for Contact Form ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [captchaToken, setCaptchaToken] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch Settings Data
  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/settings`
        );
        const result = await response.json();
        if (result.success) {
          setSettings(result.data);
        }
      } catch (error) {
        console.error("Failed fetching settings:", error);
      } finally {
        setIsSettingsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    if (token) {
      setErrors((prev) => {
        const { captcha, ...rest } = prev;
        return rest;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter valid 10 digit phone number";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    if (!captchaToken) newErrors.captcha = "Please complete the captcha verification";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/inquiries`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, captchaToken }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage("Inquiry submitted successfully.");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        setCaptchaToken(null);
        recaptchaRef.current?.reset();
      } else {
        setErrorMessage(data.message || "Verification failed.");
        setCaptchaToken(null);
        recaptchaRef.current?.reset();
      }
    } catch (error) {
      setErrorMessage("Something went wrong.");
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[var(--color-section)] min-h-screen pb-12 sm:pb-20 md:pb-28">
      {/* 2. THE MAIN SPLIT GRID CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-8 md:mt-12">

        {/* Card block settings optimized for Mobile vs Desktop display */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-0 bg-transparent md:bg-[var(--color-card)] rounded-none md:rounded-[var(--radius-lg)] border-0 md:border overflow-hidden shadow-none md:shadow-2xl">

          {/* LEFT 50%: Info Details panel */}
          <div className="p-2 sm:p-6 md:p-10 lg:p-16 md:border-r border-[var(--color-border)] flex flex-col justify-between md:bg-gradient-to-b md:from-[var(--color-card)] md:to-[var(--color-section)]">
            <div className="space-y-3 md:space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] block">Get In Touch</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-primary)]">
                Contact Information
              </h2>
              <p className="text-[var(--color-secondary)] max-w-sm text-sm sm:text-base leading-relaxed">
                Have questions regarding our products or dealer network? Contact our desk directly or drop an inquiry.
              </p>
            </div>

            {/* Individual Info Segments */}
            <div className="mt-6 md:mt-12 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-4 sm:gap-6 md:gap-8">
              {/* Address */}
              <div className="border-b sm:border-b-0 md:border-b border-[var(--color-border)] pb-3 sm:pb-0 md:pb-4 last:border-b-0">
                <h4 className="text-xs uppercase font-bold tracking-wider text-[var(--color-secondary)]">Our Location</h4>
                {isSettingsLoading ? (
                  <div className="h-4 w-40 bg-[var(--color-border)] animate-pulse rounded mt-2" />
                ) : settings?.address ? (
                  <a
                    href="https://maps.app.goo.gl/XWgJTghvD135CPP86"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1 text-[var(--color-text)] text-sm sm:text-base font-medium hover:text-[var(--color-primary)] transition-colors duration-300 cursor-pointer"
                  >
                    {settings.address}
                  </a>
                ) : (
                  <p className="mt-1 text-[var(--color-text)] text-sm sm:text-base font-medium">
                    Address Not Available
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="border-b sm:border-b-0 md:border-b border-[var(--color-border)] pb-3 sm:pb-0 md:pb-4 last:border-b-0">
                <h4 className="text-xs uppercase font-bold tracking-wider text-[var(--color-secondary)]">Call Support</h4>
                {isSettingsLoading ? (
                  <div className="h-4 w-28 bg-[var(--color-border)] animate-pulse rounded mt-2" />
                ) : settings?.phone ? (
                  <a href={`tel:${settings.phone}`} className="mt-1 inline-block text-[var(--color-text)] text-sm sm:text-base font-medium hover:text-[var(--color-accent)] transition">
                    {settings.phone}
                  </a>
                ) : (
                  <p className="mt-1 text-[var(--color-secondary)] italic text-sm">Phone Missing</p>
                )}
              </div>

              {/* Email */}
              <div className="pb-3 sm:pb-0 md:pb-0">
                <h4 className="text-xs uppercase font-bold tracking-wider text-[var(--color-secondary)]">Email Desk</h4>
                {isSettingsLoading ? (
                  <div className="h-4 w-36 bg-[var(--color-border)] animate-pulse rounded mt-2" />
                ) : settings?.email ? (
                  <a href={`mailto:${settings.email}`} className="mt-1 inline-block text-[var(--color-text)] text-sm sm:text-base font-medium break-all hover:text-[var(--color-accent)] transition">
                    {settings.email}
                  </a>
                ) : (
                  <p className="mt-1 text-[var(--color-secondary)] italic text-sm">Email Missing</p>
                )}
              </div>
            </div>

            <div className="mt-6 md:mt-12 pt-4 md:pt-6 border-t border-[var(--color-border)] text-xs sm:text-sm text-[var(--color-secondary)]">
              <span className="font-bold text-[var(--color-text)]">Office Hours:</span> Mon - Sat, 9:00 AM — 6:00 PM
            </div>
          </div>

          {/* RIGHT 50%: Form Entry panel */}
          <div className="p-4 sm:p-6 md:p-10 lg:p-16 bg-[var(--color-card)] rounded-[var(--radius-lg)] md:rounded-none border md:border-0 border-[var(--color-border)] shadow-md md:shadow-none flex flex-col justify-center">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--color-primary)]">Send a Message</h3>
                <p className="text-xs text-[var(--color-secondary)] mt-0.5">Please fill out the details below.</p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border bg-[var(--color-section)] border-[var(--color-border)] rounded-[var(--radius-md)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
                  />
                  {errors.name && <p className="text-[var(--danger)] text-xs mt-1 px-1">{errors.name}</p>}
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border bg-[var(--color-section)] border-[var(--color-border)] rounded-[var(--radius-md)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
                  />
                  {errors.email && <p className="text-[var(--danger)] text-xs mt-1 px-1">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <input
                      type="text"
                      name="phone"
                      required
                      placeholder="Phone (10 digits)"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border bg-[var(--color-section)] border-[var(--color-border)] rounded-[var(--radius-md)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
                    />
                    {errors.phone && <p className="text-[var(--danger)] text-xs mt-1 px-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="subject"
                      required
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full border bg-[var(--color-section)] border-[var(--color-border)] rounded-[var(--radius-md)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
                    />
                    {errors.subject && <p className="text-[var(--danger)] text-xs mt-1 px-1">{errors.subject}</p>}
                  </div>
                </div>

                <div>
                  <textarea
                    rows={4}
                    name="message"
                    required
                    placeholder="Write your message details here..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full border bg-[var(--color-section)] border-[var(--color-border)] rounded-[var(--radius-md)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition resize-none"
                  />
                  {errors.message && <p className="text-[var(--danger)] text-xs mt-1 px-1">{errors.message}</p>}
                </div>
              </div>

              {/* Action Rows */}
              <div className="space-y-4 pt-1">
                <div className="max-w-full overflow-x-auto overflow-y-hidden py-1 clear-both">
                  <div className="inline-block origin-left scale-[0.85] xs:scale-100">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                      onChange={handleCaptchaChange}
                    />
                  </div>
                </div>
                {errors.captcha && <p className="text-[var(--danger)] text-xs px-1">{errors.captcha}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--color-accent)] text-white py-3 rounded-[var(--radius-md)] font-semibold shadow-md hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? "Sending Entry..." : "Send Message"}
                </button>
              </div>

              {/* Status messages alerts */}
              {successMessage && (
                <div className="p-3 bg-[var(--success)]/10 text-[var(--success)] rounded-[var(--radius-md)] text-xs font-medium">
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="p-3 bg-[var(--danger)]/10 text-[var(--danger)] rounded-[var(--radius-md)] text-xs font-medium">
                  {errorMessage}
                </div>
              )}
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}