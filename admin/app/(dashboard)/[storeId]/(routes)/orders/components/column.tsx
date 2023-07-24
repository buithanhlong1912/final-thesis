'use client';

import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell-action';

export type OrderColumn = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  products: string;
  totalPrice: string;
  updatedAt: string;
  isPaid: boolean;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: 'customerName',
    header: 'Khách hàng',
  },
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
  },
  {
    accessorKey: 'totalPrice',
    header: 'Tổng tiền',
  },
  {
    accessorKey: 'isPaid',
    header: 'Đã thanh toán',
  },
  {
    accessorKey: 'updatedAt',
    header: 'Date',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
