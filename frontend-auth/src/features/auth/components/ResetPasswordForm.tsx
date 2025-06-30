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
import type { IResetPasswordData } from "../types/auth";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth.store";
import { toast } from "sonner";

const formSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirm_password: z.string().min(6, {
    message: "Confirm password must be at least 6 characters.",
  }),
});

const initValues: IResetPasswordData = {
  token: "",
  password: "",
  confirm_password: "",
};

const ResetPasswordForm = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initValues,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const token = searchParams.get("token");

    if (!token) {
      toast(`Token not found. Please log in again.`, {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    submitResult.mutate({ ...values, token: token });
  }

  const { resetPassword } = useAuthStore();
  const submitResult = useMutation({
    mutationFn: (data: IResetPasswordData) => {
      return resetPassword(data);
    },
    onSuccess(data) {
      toast(data?.message, {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });

      navigate("/signin");
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
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

export default ResetPasswordForm;
