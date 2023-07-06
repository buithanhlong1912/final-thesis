'use client';

import { Billboard } from '@prisma/client';
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
    label: z.string().min(1),
    imageUrl: z.string().min(1),
});

type BillboardFormValue = z.infer<typeof formSchema>;

interface BillboardFormProps {
    initialData: Billboard | null;
}

const BillboardForm: React.FC<BillboardFormProps> = ({
    initialData,
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData
        ? 'Chỉnh sửa trang bìa'
        : 'Thêm mới trang bìa';
    const description = initialData
        ? 'Chỉnh sửa thông tin trang bìa'
        : 'Thêm mới thông tin trang bìa';
    const toastMessage = initialData
        ? 'Chỉnh sửa trang bìa thành công!'
        : 'Thêm mới trang bìa thành công!';
    const action = initialData
        ? 'Lưu thông tin trang bìa'
        : 'Thêm mới';

    const form = useForm<BillboardFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: '',
        },
    });

    const onSubmit = async (data: BillboardFormValue) => {
        try {
            setLoading(true);
            await axios.patch(
                `/api/stores/${params.storeId}`,
                data
            );
            router.refresh();
            toast.success('Cập nhật thông tin thành công!');
        } catch (err) {
            toast.error('Lỗi khi cập nhật!');
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(
                `/api/stores/${params.storeId}`
            );
            toast.success('Đã xóa thành công cửa hàng!');
            router.refresh();
            router.push('/');
        } catch (err) {
            toast.error(
                'Hãy chắc chắn rằng đã hóa tất cả thông tin hành hóa trước khi xóa cửa hàng.'
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
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Label
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={
                                                loading
                                            }
                                            placeholder="Thông tin hiện lên trên ảnh trang bìa"
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

export default BillboardForm;
