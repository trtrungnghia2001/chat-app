import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import type { IForgotPasswordData } from "../types/auth";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth.store";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().min(1, {
    message: "Email is required.",
  }),
});

const initValues: IForgotPasswordData = {
  email: "",
};

const ForgotPasswordForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initValues,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    submitResult.mutate(values);
  }

  const { forgotPassword } = useAuthStore();
  const submitResult = useMutation({
    mutationFn: (data: IForgotPasswordData) => {
      return forgotPassword(data);
    },
    onSuccess(data) {
      toast(data?.message, {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    },
    onError(error) {
      toast(error.message, {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={submitResult.isPending}
          type="submit"
          className="w-full"
        >
          Submit
        </Button>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to={`/signin`} className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
