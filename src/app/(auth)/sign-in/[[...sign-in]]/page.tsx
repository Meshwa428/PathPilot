import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignIn
      signUpUrl="/sign-up"
      appearance={{
        variables: {
          colorPrimary: "#2563eb", // Brand Blue
          colorText: "#0f172a", // Slate-900
          colorTextSecondary: "#64748b", // Slate-500
          colorBackground: "#ffffff", // Solid White (Fixes the dark bar issue)
          borderRadius: "0.5rem", // Standard, professional radius
        },
        elements: {
          // Main Card: Clean white surface with a subtle shadow to lift it off the background
          card: "shadow-xl border border-slate-200 rounded-xl",
          
          // Social Buttons: Fix the "blending in" issue by adding a border
          socialButtonsBlockButton: "border border-slate-200 hover:bg-slate-50",
          
          // Primary Button: Matches your landing page buttons
          formButtonPrimary: "bg-blue-600 hover:bg-blue-700 shadow-md transition-all",
          
          // Footer: Simple text styling, no weird background blocks
          footerActionLink: "text-blue-600 hover:text-blue-700 font-medium hover:underline",
          
          // Development Badge: Make it look decent
          identityPreviewText: "text-slate-600",
          formFieldInput: "border-slate-300 focus:border-blue-600 focus:ring-blue-600",
        }
      }}
    />
  );
}