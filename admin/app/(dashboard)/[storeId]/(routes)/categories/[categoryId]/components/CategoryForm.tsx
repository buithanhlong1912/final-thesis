'use client';

import { Category } from '@prisma/client';
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

const formSchema = z.object({
    name: z.string().min(1),
});

type CategoryFormValue = z.infer<typeof formSchema>;

interface CategoryFormProps {
    initialData: Category | null;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData,
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData
        ? 'Chỉnh sửa danh mục'
        : 'Thêm mới danh mục';
    const description = initialData
        ? 'Chỉnh sửa thông tin danh mục'
        : 'Thêm mới thông tin danh mục';
    const toastMessage = initialData
        ? 'Chỉnh sửa danh mục thành công!'
        : 'Thêm mới danh mục thành công!';
    const action = initialData
        ? 'Lưu thông tin danh mục'
        : 'Thêm mới';

    const form = useForm<CategoryFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
        },
    });

    const onSubmit = async (data: CategoryFormValue) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(
                    `/api/${params.storeId}/categories/${params.categoryId}`,
                    data
                );
            } else {
                await axios.post(
                    `/api/${params.storeId}/categories`,
                    data
                );
            }
            router.refresh();
            router.push(`/${params.storeId}/categories`);
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
                `/api/${params.storeId}/categories/${params.categoryId}`
            );
            toast.success(
                'Đã xóa thành công danh mục sản phẩm!'
            );
            router.refresh();
            router.push(`/${params.storeId}/categories`);
        } catch (err) {
            toast.error(
                'Hãy chắc chắn rằng đã hóa tất cả thông tin liên quan đến danh mục này.'
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
                title="Bạn có muốn xóa danh mục?"
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
                                        Tên Danh Mục
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={
                                                loading
                                            }
                                            placeholder="Tên danh mục của sản phẩm"
                                            {...field}
                                        />
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

export default CategoryForm;
