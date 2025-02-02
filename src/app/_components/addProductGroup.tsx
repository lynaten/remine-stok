"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import {
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(50),
  description: z.string(),
});

export function AddProductGroupForm() {
  const addProductGroupForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createProductGroup = api.productGroup.create.useMutation({
    onSuccess: () => {
      console.log("Success!");
    },
  });

  function onSubmitProductGroup(
    event: React.FormEvent<HTMLFormElement>, // Prevent parent form submission
  ) {
    event.preventDefault(); // 🔥 FIX: Prevent submitting the parent form

    const values = addProductGroupForm.getValues();
    console.log("ADD PRODUCT GROUP TRIGGERED");
    console.log(values);
    // createProductGroup.mutate(values);
  }

  return (
    <Form {...addProductGroupForm}>
      <form
        onSubmit={onSubmitProductGroup} // 🔥 Use custom function to prevent submit
        className="space-y-8"
      >
        <FormField
          control={addProductGroupForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Type here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={addProductGroupForm.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction type="submit">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </form>
    </Form>
  );
}
