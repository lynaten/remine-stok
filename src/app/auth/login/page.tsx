import { HydrateClient } from "@/trpc/server";
import React from "react";

import LoginForm from "@/app/_components/loginForm";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const page = () => {
  return (
    <HydrateClient>
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Remine Sign in</CardTitle>
            <CardDescription>Welcome back</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm></LoginForm>
          </CardContent>
        </Card>
      </div>
    </HydrateClient>
  );
};

export default page;
