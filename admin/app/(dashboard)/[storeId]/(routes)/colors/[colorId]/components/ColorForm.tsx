'use client';

import { Color } from '@prisma/client';
import { Trash } from 'lucide-react';
import React, { useState } from 'react';
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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AlertModal from '@/components/modals/alert-modals';
import ImageUpload from '@/components/ui/image-upload';

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(4).max(9).regex(/^#/, {
        message: 'String must be a valid hex code',
    }),
});

type ColorFormValue = z.infer<typeof formSchema>;

interface ColorFormProps {
    initialData: Color | null;
}

const ColorForm: React.FC<ColorFormProps> = ({
    initialData,
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData
        ? 'Chỉnh sửa màu sắc'
        : 'Thêm mới màu sắc';
    const description = initialData
        ? 'Chỉnh sửa thông tin màu sắc'
        : 'Thêm mới thông tin màu sắc';
    const toastMessage = initialData
        ? 'Chỉnh sửa màu sắc thành công!'
        : 'Thêm mới màu sắc thành công!';
    const action = initialData
        ? 'Lưu thông tin màu sắc'
        : 'Thêm mới';

    const form = useForm<ColorFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: '',
        },
    });

    const onSubmit = async (data: ColorFormValue) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(
                    `/api/${params.storeId}/colors/${params.billboardId}`,
                    data
                );
            } else {
                await axios.post(
                    `/api/${params.storeId}/colors`,
                    data
                );
            }
            router.refresh();
            router.push(`/${params.storeId}/colors`);
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
                `/api/${params.storeId}/colors/${params.billboardId}`
            );
            toast.success('Đã xóa thành công trang bìa!');
            router.refresh();
            router.push(`/${params.storeId}/colors`);
        } catch (err) {
            toast.error(
                'Hãy chắc chắn rằng đã hóa tất cả thông tin liên quan đến trang bìa này.'
            );
        } finally {
            setLoading(false);
            setOpen(false);
        }
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
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description}
                />
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
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Tên màu
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={
                                                loading
                                            }
                                            placeholder="Tên được gán cho màu sắc"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Mã màu
                                    </FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-x-4">
                                            <Input
                                                disabled={
                                                    loading
                                                }
                                                placeholder="Mã màu sắc"
                                                {...field}
                                            />
                                            <div
                                                className="border p-4 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        field.value,
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
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

export default ColorForm;
