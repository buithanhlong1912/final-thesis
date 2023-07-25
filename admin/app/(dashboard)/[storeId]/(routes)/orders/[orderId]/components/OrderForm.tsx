'use client';

import {
  Category,
  Brand,
  Color,
  Order,
  OrderItem,
  Product,
} from '@prisma/client';
import { Trash, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AlertModal from '@/components/modals/alert-modals';
import ImageUpload from '@/components/ui/image-upload';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  customerName: z.string().min(1),
  orderItems: z
    .object({
      productId: z.string(),
      quantity: z.any(),
    })
    .array(),
  address: z.string().min(1),
  phone: z.string().min(1),
  isPaid: z.boolean().default(false).optional(),
});

type ProductFormValue = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData:
    | (Order & {
        orderItems: OrderItem[];
      })
    | null;
  products: Product[];
}

const OrderForm: React.FC<ProductFormProps> = ({
  initialData,
  products,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>(
    []
  );

  const title = initialData
    ? 'Chỉnh sửa hóa đơn'
    : 'Thêm mới hóa đơn';
  const description = initialData
    ? 'Chỉnh sửa thông tin hóa đơn'
    : 'Thêm mới thông tin hóa đơn';
  const toastMessage = initialData
    ? 'Chỉnh sửa hóa đơn thành công!'
    : 'Thêm mới hóa đơn thành công!';
  const action = initialData
    ? 'Lưu thông tin hóa đơn'
    : 'Thêm mới';

  const form = useForm<ProductFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          customerName: '',
          phone: '',
          address: '',
          orderItems: orderItems,
          isPaid: false,
        },
  });

  useEffect(() => {
    if (initialData) setOrderItems(initialData.orderItems);
  }, [initialData]);

  const onSubmit = async (data: ProductFormValue) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/orders/${params.orderId}`,
          data
        );
      } else {
        await axios.post(
          `/api/${params.storeId}/orders`,
          data
        );
      }
      router.refresh();
      router.push(`/${params.storeId}/orders`);
      toast.success(toastMessage);
    } catch (err) {
      toast.error('Lỗi khi xử lý!');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/orders/${params.orderId}`
      );
      toast.success('Đã xóa thành công hóa đơn!');
      router.refresh();
      router.push(`/${params.storeId}/orders`);
    } catch (err) {
      toast.error(
        'Hãy chắc chắn rằng đã hóa tất cả thông tin liên quan đến hóa đơn này.'
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onAddProduct = () => {
    setOrderItems([
      ...orderItems,
      {
        productId: '',
        quantity: 0,
      },
    ] as any);
  };

  const onRemoveProduct = (id: string) => {
    const remaining = initialData
      ? [...initialData.orderItems].filter(
          (item) => item.id !== id
        )
      : [...orderItems].filter((item) => item.id !== id);
    console.log(remaining);
    setOrderItems(remaining);
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
        title="Bạn có muốn xóa hóa đơn?"
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Khách hàng</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Tên của khách hàng"
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
                      type="string"
                      disabled={loading}
                      placeholder="0xxxx"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ giao hàng</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={loading}
                    placeholder=""
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isPaid"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange as any}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Thanh toán</FormLabel>
                  <FormDescription>
                    Hóa đơn này đã được thanh toán
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant={'outline'}
            onClick={onAddProduct}
          >
            Thêm sản phẩm
          </Button>
          <FormField
            control={form.control}
            name="orderItems"
            render={({ field }) => (
              <>
                {orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="md:grid md:grid-cols-3 gap-8 flex items-end"
                  >
                    <FormField
                      control={form.control}
                      name={`orderItems.${index}.productId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sản phẩm</FormLabel>
                          <Select
                            disabled={loading}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder="Chọn danh mục cho sản phẩm"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem
                                  key={product.id}
                                  value={product.id}
                                >
                                  {product?.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`orderItems.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số lượng</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              disabled={loading}
                              placeholder="1.000"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() =>
                        onRemoveProduct(item.id)
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </>
            )}
          />
          <Button
            disabled={loading}
            className="ml-auto"
            type="submit"
          >
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default OrderForm;
