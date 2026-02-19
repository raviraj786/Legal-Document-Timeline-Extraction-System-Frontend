"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuthStore } from "@/store/authStore.";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

import ThemeToggle from "@/components/theme-toggle";

export default function SignupPage() {

  const router = useRouter();

  const signup = useAuthStore((state) => state.signup);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [localError, setLocalError] = useState("");

  /**
   * Handle Signup
   */
  const handleSignup = async () => {

    setLocalError("");

    // validation
    if (!email || !password) {

      setLocalError("Email and password required");
      return;

    }

    if (password.length < 6) {

      setLocalError("Password must be at least 6 characters");
      return;

    }

     if (loading) return;

    const success = await signup(email, password);

    if (success) {

      router.push("/dashboard");

    }

  };


  return (

    <div className="flex items-center justify-center min-h-screen bg-background px-4">

      <Card className="w-full max-w-sm p-6 space-y-4 shadow-md">

        {/* Header */}
        <div className="flex justify-between items-center">

          <h1 className="text-xl font-bold">
            Signup
          </h1>

          <ThemeToggle />

        </div>


        {/* Email */}
        <Input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />


        {/* Password */}
        <Input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />


        {/* Local Error */}
        {localError && (

          <p className="text-red-500 text-sm">
            {localError}
          </p>

        )}


        {/* Server Error */}
        {error && (

          <p className="text-red-500 text-sm">
            {error}
          </p>

        )}


        {/* Button */}
        <Button
          onClick={handleSignup}
          disabled={loading}
          className="w-full"
        >

          {loading
            ? "Creating account..."
            : "Signup"}

        </Button>


        {/* Login Link */}
        <p className="text-sm text-center text-muted-foreground">

          Already have an account?{" "}

          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            Login
          </Link>

        </p>


      </Card>

    </div>

  );

}
