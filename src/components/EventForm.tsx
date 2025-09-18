"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

type Field = {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  placeholder?: string;
};

type EventConfig = {
  logo: string;
  title: string;
  description: string;
  fields: Field[];
};

const eventForms: Record<string, EventConfig> = {
  hackathon: {
    logo: "/logos/resourciologo.svg",
    title: "Hackathon 2025",
    description: "Innovate, code, and compete in 36 hours!",
    fields: [
      { label: "Full Name", name: "name", type: "text", required: true, placeholder: "Enter your full name" },
      { label: "Email", name: "email", type: "email", required: true, placeholder: "Enter your email" },
      { label: "Team Name", name: "team", type: "text", placeholder: "Enter your team name" },
      { label: "GitHub Link", name: "github", type: "url", placeholder: "https://github.com/username" },
      { label: "Expectations", name: "expectations", type: "textarea", placeholder: "What do you expect from this event?" },
    ],
  },
  workshop: {
    logo: "/logos/resourciologo.svg",
    title: "Workshop 2025",
    description: "Learn hands-on skills with expert guidance.",
    fields: [
      { label: "Full Name", name: "name", type: "text", required: true, placeholder: "Enter your full name" },
      { label: "Email", name: "email", type: "email", required: true, placeholder: "Enter your email" },
      { label: "College / Organization", name: "organization", type: "text", placeholder: "Enter your college/organization" },
      { label: "Skill Level", name: "skill", type: "text", placeholder: "Beginner / Intermediate / Advanced" },
      { label: "Expectations", name: "expectations", type: "textarea", placeholder: "What do you expect from this workshop?" },
    ],
  },
  meetup: {
    logo: "/logos/apertrelogo.svg",
    title: "Meetup 2025",
    description: "Connect with experts and enthusiasts.",
    fields: [
      { label: "Full Name", name: "name", type: "text", required: true, placeholder: "Enter your full name" },
      { label: "Email", name: "email", type: "email", required: true, placeholder: "Enter your email" },
      { label: "Phone Number", name: "phone", type: "phone", placeholder: "1234567890" },
      { label: "Expectations", name: "expectations", type: "textarea", placeholder: "What do you expect from this meetup?" },
    ],
  },
  team: {
    logo: "/logos/resourciologo.svg",
    title: "Team Registration",
    description: "Join our team and collaborate on exciting projects!",
    fields: [
      { label: "Full Name", name: "name", type: "text", required: true, placeholder: "Enter your full name" },
      { label: "Email", name: "email", type: "email", required: true, placeholder: "Enter your email" },
      { label: "Phone Number", name: "phone", type: "phone", placeholder: "1234567890" },
      { label: "Expectations", name: "expectations", type: "textarea", placeholder: "What do you expect from joining this team?" },
    ],
  },
};

export default function EventForm({ eventKey }: { eventKey: string }) {
  const config = eventForms[eventKey];
  const fields = config?.fields ?? [];

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ type: "idle" | "pending" | "success" | "error"; message?: string }>({ type: "idle" });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initial: Record<string, string> = {};
    fields.forEach((f) => (initial[f.name] = ""));
    initial["countryCode"] = "+91";
    setFormData(initial);
    setStatus({ type: "idle" });
  }, [eventKey, fields]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "pending" });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("❌ Invalid email address");
      setStatus({ type: "error", message: "Invalid email address" });
      return;
    }
    if (formData.phone && !/^[0-9]{7,15}$/.test(formData.phone)) {
      toast.error("❌ Phone must be 7–15 digits");
      setStatus({ type: "error", message: "Invalid phone number" });
      return;
    }

    try {
      const SHEETDB_URL = "https://sheetdb.io/api/v1/YOUR_API_KEY"; // replace with SheetDB

      const res = await fetch(SHEETDB_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            {
              event: eventKey,
              ...formData,
              phone: formData.countryCode ? `${formData.countryCode}${formData.phone}` : formData.phone,
            },
          ],
        }),
      });

      const text = await res.text();
      console.log(res.status, text);

      if (!res.ok) throw new Error(`Submission failed!`);

      toast.success("✅ Registered successfully!");
      setStatus({ type: "success", message: "Registered successfully!" });
      setShowSuccessModal(true);

      setFormData((prev) => {
        const reset = { ...prev };
        fields.forEach((f) => (reset[f.name] = ""));
        return reset;
      });
    } catch (err: any) {
      console.error(err);
      toast.error("❌ Submission failed!");
      setStatus({ type: "error", message: "Submission failed!" });
    }
  };

  if (!config || !mounted) return null;

  return (
    <div className="min-h-screen flex flex-col 
                bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 
                dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 
                transition-colors relative">
      <Toaster position="top-right" />

      <main className="flex-1 flex justify-center items-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl p-12 rounded-3xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700"
        >
          {/* Header: Logo + Title */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-15 mb-10">
            {config.logo && <Image src={config.logo} alt="Event Logo" width={100} height={100} className="rounded-xl" />}
            <div className="text-center md:text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{config.title}</h1>
              <p className="mt-2 text-gray-700 dark:text-gray-300">{config.description}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((f, idx) => (
              <div key={idx} className="flex flex-col">
                <label className="text-gray-900 dark:text-white font-medium mb-2">
                  {f.label} {f.required && "*"}
                </label>

                {f.type === "textarea" ? (
                  <textarea
                    name={f.name}
                    placeholder={f.placeholder}
                    value={formData[f.name] ?? ""}
                    onChange={handleChange}
                    required={f.required}
                    className="px-4 py-4 rounded-2xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all resize-none h-28"
                  />
                ) : f.type === "phone" ? (
                  <div className="flex gap-3">
                    <select
                      name="countryCode"
                      value={formData.countryCode ?? "+91"}
                      onChange={handleChange}
                      className="px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+61">+61</option>
                      <option value="+81">+81</option>
                      <option value="+49">+49</option>
                    </select>
                    <input
                      name={f.name}
                      type="tel"
                      placeholder={f.placeholder}
                      value={formData[f.name] ?? ""}
                      onChange={handleChange}
                      required={f.required}
                      className="flex-1 px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                    />
                  </div>
                ) : (
                  <input
                    name={f.name}
                    type={f.type}
                    placeholder={f.placeholder}
                    value={formData[f.name] ?? ""}
                    onChange={handleChange}
                    required={f.required}
                    className="px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={status.type === "pending"}
              className="w-full py-4 text-xl font-bold bg-gradient-to-br from-green-400 border to-green-600 text-white rounded-3xl hover:scale-105 transition-transform disabled:opacity-50"
            >
              {status.type === "pending" ? "Submitting..." : "Register"}
            </button>
          </form>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-slate-700 text-center text-white mt-auto rounded-t-3xl">
        Powered by <span className="font-semibold">Resourcio Community</span>
      </footer>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-10 flex flex-col items-center shadow-xl"
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
                className="w-20 h-20 text-green-500 mb-4"
              >
                <motion.circle
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  d="M14 27l7 7 17-17"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                />
              </motion.svg>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Registration Successful!</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
                Thank you for registering. We will contact you soon.
              </p>
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700"
                onClick={() => setShowSuccessModal(false)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
