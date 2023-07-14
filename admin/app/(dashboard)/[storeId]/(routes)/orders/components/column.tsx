'use client';

import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell-action';

export type OrderColumn = {
    id: string;
    phone: string;
    address: string;
    products: string;
    totalPrice: string;
    updatedAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
    {
        accessorKey: 'phone',
        header: 'Số điện thoại',
    },
    {
        accessorKey: 'address',
        header: 'Địa chỉ nhận hàng',
    },
    {
        accessorKey: 'products',
        header: 'Sản phẩm',
        // cell: ({ row }) => {
        //     <div>
        //         {row.original.products.map((product) => (
        //             <div>

        //             </div>
        //         ))}
        //     </div>;
        // },
    },
    {
        accessorKey: 'totalPrice',
        header: 'Tổng tiền',
    },
    {
        accessorKey: 'updatedAt',
        header: 'Date',
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <CellAction data={row.original} />
        ),
    },
];
