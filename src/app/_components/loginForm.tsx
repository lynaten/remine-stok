"use client";
import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
const LoginForm = () => {
  return (
    <Button
      onClick={() => {
        signIn("google", { callbackUrl: DEFAULT_LOGIN_REDIRECT });
      }}
    >
      Login in with Google
    </Button>
  );
};

export default LoginForm;
