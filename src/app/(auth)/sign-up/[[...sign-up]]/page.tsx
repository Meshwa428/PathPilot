'use client';

import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} // Starts slightly right
      animate={{ opacity: 1, x: 0 }}  // Slides to center
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full"
    >
      <SignUp
        signInUrl="/sign-in"
        appearance={{
          variables: {
            colorPrimary: "#2563eb",
            colorText: "#0f172a",
            colorTextSecondary: "#64748b",
            colorBackground: "#ffffff",
            borderRadius: "0.5rem",
          },
          elements: {
            card: "shadow-xl border border-slate-200 rounded-xl",
            socialButtonsBlockButton: "border border-slate-200 hover:bg-slate-50",
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700 shadow-md transition-all",
            footerActionLink: "text-blue-600 hover:text-blue-700 font-medium hover:underline",
            identityPreviewText: "text-slate-600",
            formFieldInput: "border-slate-300 focus:border-blue-600 focus:ring-blue-600",
          }
        }}
      />
    </motion.div>
  );
}