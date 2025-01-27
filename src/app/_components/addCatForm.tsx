"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@/trpc/react";
import { useState } from "react";
import AlertMessage from "./AlertMessage";

import { AlertDialogCancel } from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Category name is required.",
  }),
  description: z.string().min(2, {
    message: "Description is required.",
  }),
});

export function AddCatForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const createCategory = api.category.createCategory.useMutation({
    onSuccess: (data) => {
      //   console.log("Category created:", data);
      setMessage("Category successfully created");
      setSuccess(true);
    },
    onError: (error) => {
      const simplifiedMessage = "An unexpected error occurred.";
      setMessage(`Error creating category: ${simplifiedMessage}`);
      setSuccess(false);
      //   console.error("Error creating category:", error);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createCategory.mutate(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter the name for your new category.</FormLabel>
              <FormControl>
                <Input placeholder="Category name " {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Enter the description for your new category.
              </FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <AlertDialogCancel className="mr-3">Cancel</AlertDialogCancel>

        <Button type="submit" disabled={createCategory.isPending}>
          {createCategory.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
      {message && <AlertMessage type={success}>{message}</AlertMessage>}
    </Form>
  );
}
