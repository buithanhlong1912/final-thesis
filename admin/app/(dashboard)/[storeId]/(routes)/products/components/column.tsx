'use client';

import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell-action';

export type ProductColumn = {
    id: string;
    name: string;
    price: string;
    brand: string;
    color: string;
    category: string;
    isFeatured: boolean;
    isArchived: boolean;
    updatedAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: 'name',
        header: 'Tên sản phẩm',
    },
    {
        accessorKey: 'price',
        header: 'Giá tiền',
    },
    {
        accessorKey: 'brand',
        header: 'Nhãn hàng',
    },
    {
        accessorKey: 'color',
        header: 'Màu sắc',
        cell: ({ row }) => (
            <div className="flex items-center gap-x-2">
                {row.original.color}
                <div
                    className="h-6 w-6 rounded-full border"
                    style={{
                        backgroundColor: row.original.color,
                    }}
                />
            </div>
        ),
    },
    {
        accessorKey: 'category',
        header: 'Thể loại',
    },
    {
        accessorKey: 'isArchived',
        header: 'Tình trạng',
        cell: ({ row }) => (
            <span>
                {row.original.isArchived
                    ? 'Đã hết hàng'
                    : 'Còn hàng'}
            </span>
        ),
    },
    {
        accessorKey: 'isFeatured',
        header: 'Nổi bật',
        cell: ({ row }) => (
            <span>
                {row.original.isFeatured
                    ? 'Đang hiển thị'
                    : 'Không hiển thị'}
            </span>
        ),
    },
    {
        accessorKey: 'updatedAt',
        header: 'Lần cuối chỉnh sửa',
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <CellAction data={row.original} />
        ),
    },
];
