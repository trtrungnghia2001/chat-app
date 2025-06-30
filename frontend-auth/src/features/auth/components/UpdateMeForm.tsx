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
import type { IUser } from "../types/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth.store";
import { toast } from "sonner";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { gender_options } from "../constants/options";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  gender: z.string().optional(),
  avatar: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  birthday: z.string().optional(),
  work: z.string().optional(),
  education: z.string().optional(),
  bio: z.string().optional(),
  link_website: z.string().optional(),
});

const initValues: Partial<IUser> = {
  name: "",
  gender: "",
  avatar: "",
  phoneNumber: "",
  address: "",
  birthday: "",
  work: "",
  education: "",
  bio: "",
  link_website: "",
};

const UpdateMeForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initValues,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    submitResult.mutate(values);
  }

  const { updateMe, getMe } = useAuthStore();
  const getMeResult = useQuery({
    queryKey: ["auth/get-me"],
    queryFn: async () => {
      return await getMe();
    },
  });
  useEffect(() => {
    if (getMeResult.data && getMeResult.isSuccess) {
      form.reset(getMeResult.data.data);
    }
  }, [getMeResult.data, getMeResult.isSuccess, form]);
  const submitResult = useMutation({
    mutationFn: (data: Partial<IUser>) => {
      return updateMe(data);
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
        {(
          Object.keys(formSchema.shape).filter(
            (item) => item !== "avatar"
          ) as Array<keyof typeof formSchema.shape>
        ).map((key) => {
          const label = key.replace(/_/gi, " ");
          return (
            <FormField
              key={key}
              control={form.control}
              name={key}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">{label}</FormLabel>
                  {key === "bio" ? (
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  ) : key === "gender" ? (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {gender_options.map((item, idx) => (
                          <SelectItem key={idx} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <FormControl>
                      <Input
                        {...field}
                        type={
                          key === "phoneNumber"
                            ? "tel"
                            : key === "birthday"
                            ? "date"
                            : "text"
                        }
                        onChange={(e) => {
                          if (key === "phoneNumber") {
                            const newValue = e.target.value.replace(/\D/g, ""); // Loại bỏ các ký tự không phải số
                            field.onChange(newValue);
                          } else if (key === "birthday") {
                            field.onChange(e.target.value);
                          } else {
                            field.onChange(e);
                          }
                        }}
                      />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}

        <Button
          disabled={submitResult.isPending}
          type="submit"
          className="w-full"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default UpdateMeForm;
