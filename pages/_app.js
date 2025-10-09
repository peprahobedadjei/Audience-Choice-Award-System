import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState(null);

useEffect(() => {
  const validateAccessCode = async () => {
    // Skip validation for admin routes
    if (router.pathname.startsWith('/admin')) {
      return;
    }

    // Get access code from URL
    const urlParams = new URLSearchParams(window.location.search);
    const accessCode = urlParams.get("access_code");

    // Check if code exists in localStorage
    const storedCode = localStorage.getItem("access_code");

    // If no code in URL and no stored code, show error
    if (!accessCode && !storedCode) {
      setValidationError("No access code provided");
      return;
    }

    // If code already validated and stored, allow access
    if (storedCode && !accessCode) {
      return; // User already has valid access
    }

    // If new code in URL, validate it
    if (accessCode) {
      setIsValidating(true);

      try {
        const response = await fetch(
          "https://audience-choice-award-backend.vercel.app/api/validate-code",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ accessCode }),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || "Invalid access code");
        }

        // Code is valid - store it
        localStorage.setItem("access_code", accessCode);

        // Remove code from URL and redirect to home
        router.push("/");
      } catch (error) {
        setValidationError(error.message);
      } finally {
        setIsValidating(false);
      }
    }
  };

  validateAccessCode();
}, [router]);

  // Show validation spinner
  if (isValidating) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        {/* Custom Font Loading */}
        <style jsx global>{`
          @font-face {
            font-family: "Squartiqa";
            src: url("/fonts/Squartiqa4FUltraLight.ttf") format("truetype");
            font-weight: 200;
            font-style: normal;
          }
          * {
            font-family: "Squartiqa", -apple-system, BlinkMacSystemFont,
              "Segoe UI", sans-serif;
          }
        `}</style>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-2xl text-white font-light mb-2">
            Authenticating...
          </h2>
          <p className="text-cyan-300 text-sm">Validating your access code</p>
        </motion.div>
      </div>
    );
  }

  // Show error page
  if (validationError) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        {/* Custom Font Loading */}
        <style jsx global>{`
          @font-face {
            font-family: "Squartiqa";
            src: url("/fonts/Squartiqa4FUltraLight.ttf") format("truetype");
            font-weight: 200;
            font-style: normal;
          }
          * {
            font-family: "Squartiqa", -apple-system, BlinkMacSystemFont,
              "Segoe UI", sans-serif;
          }
        `}</style>
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-red-500/50 max-w-md w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-3xl text-white font-light mb-4">Access Denied</h2>
          <p className="text-red-300 mb-6">{validationError}</p>
          <p className="text-white/60 text-sm">
            Please scan a valid QR code to access the voting system
          </p>
        </motion.div>
      </div>
    );
  }

  // Render normal page
  return <Component {...pageProps} />;
}

export default MyApp;
