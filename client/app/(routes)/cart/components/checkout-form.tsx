"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AlertModal from "@/components/alert-modal/alert-modals";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/Button";
import axios from "axios";
import useCart from "@/hooks/useCart";

const formSchema = z.object({
  phone: z
    .string()
    .min(10)
    .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, {
      message: "Hãy nhập số điện thoại hợp lệ!",
    }),
  address: z.string().min(1),
});

type formSchemaValue = z.infer<typeof formSchema>;

const CheckoutForm = () => {
  const items = useCart((state) => state.items);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<formSchemaValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      address: "",
    },
  });

  const onDelete = () => {};

  const onSubmit = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
      {
        productIds: items.map((item) => item.id),
      }
    );

    window.location = response.data.url;
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
        onConfirm={onDelete}
        loading={loading}
        title="Bạn có muốn xóa ảnh bìa?"
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="mt-3 gap-8">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Số điện thoại người nhận hàng"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ nhận hàng</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={loading}
                        placeholder="Địa chỉ giao hàng"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={loading || items.length === 0}
            className="w-full mt-6"
            type="submit"
          >
            Thanh toán
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CheckoutForm;
