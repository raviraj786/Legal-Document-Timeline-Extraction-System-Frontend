"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuthStore } from "@/store/authStore.";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

import ThemeToggle from "@/components/theme-toggle";

export default function LoginPage() {

  const router = useRouter();

  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**
   * Handle Login
   */
  const handleLogin = async () => {

    if (!email || !password) {
      return;
    }

    const success = await login(email, password);

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
            Login
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

        {/* Error */}
        {error && (

          <p className="text-red-500 text-sm">
            {error}
          </p>

        )}

        {/* Button */}
        <Button
          onClick={handleLogin}
          disabled={loading}
          className="w-full"
        >

          {loading
            ? "Logging in..."
            : "Login"}

        </Button>

        {/* Signup link */}
        <p className="text-sm text-center text-muted-foreground">

          Don't have an account?{" "}

          <Link
            href="/signup"
            className="text-primary font-medium hover:underline"
          >
            Signup
          </Link>

        </p>

      </Card>

    </div>

  );

}
