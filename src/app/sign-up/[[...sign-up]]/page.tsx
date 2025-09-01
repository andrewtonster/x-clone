"use client";
import styles from "./SignIn.module.css";

import { SignUp } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <SignUp
        signInUrl="/sign-in"
        appearance={{
          elements: {
            footer: "hidden", // ✅ hide the footer section
            // socialButtons: "hidden", // example: hide social buttons
            // headerSubtitle: "hidden" // example: hide subtitle
          },
          variables: {
            fontFamily: "Inter, system-ui, sans-serif",
          },
        }}
      />
    </div>
  );
}
