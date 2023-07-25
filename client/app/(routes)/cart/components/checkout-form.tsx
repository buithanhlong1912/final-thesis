"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import axios from "axios";

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
import useCart from "@/hooks/useCart";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  customerName: z.string().min(10),
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
  const router = useRouter();
  const removeAll = useCart((state) => state.removeAll);

  const [loading, setLoading] = useState(false);

  const form = useForm<formSchemaValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = async (value: formSchemaValue) => {
    try {
      setLoading(true);

      const data = {
        ...value,
        isPaid: false,
        orderItems: items.map((item) => ({
          productId: item.data.id,
          quantity: item.quantity,
        })),
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, data);

      router.push("/");
      removeAll();
      toast.success("Đặt hàng thành công!");
    } catch (err) {
      console.log(err);
      toast.error("Đặt hàng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="mt-3 grid gap-2">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Người nhận hàng</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Họ tên người nhận hàng"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      <Textarea
                        className="bg-white"
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
