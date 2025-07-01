import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRoomStore } from "../stores/room";
import type { IRoom } from "../types";

const FormSchema = z.object({
  roomName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

const RoomForm = ({ children }: { children: React.ReactNode }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      roomName: "",
    },
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    createUpdateResult.mutate(data);
  }

  const { create } = useRoomStore();
  const createUpdateResult = useMutation({
    mutationFn: async (data: Partial<IRoom>) => await create(data),
    onSuccess(data) {
      toast.success(data.message);
      form.reset();
      setOpen(false);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
      }}
    >
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Room?</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="roomName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={createUpdateResult.isPending} type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomForm;
