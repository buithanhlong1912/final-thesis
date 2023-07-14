'use client';

import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell-action';

export type CategoryColumn = {
    id: string;
    name: string;
    updatedAt: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
    {
        accessorKey: 'name',
        header: 'Danh Mục',
    },
    {
        accessorKey: 'updatedAt',
        header: 'Lần chỉnh sửa cuối',
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <CellAction data={row.original} />
        ),
    },
];
