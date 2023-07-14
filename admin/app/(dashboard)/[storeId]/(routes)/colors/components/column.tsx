'use client';

import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell-action';

export type ColorColumn = {
    id: string;
    name: string;
    value: string;
    updatedAt: string;
};

export const columns: ColumnDef<ColorColumn>[] = [
    {
        accessorKey: 'name',
        header: 'Màu sắc',
    },
    {
        accessorKey: 'value',
        header: 'Giá trị',
        cell: ({ row }) => (
            <div className="flex items-center gap-x-2">
                {row.original.value}
                <div
                    className="h-6 w-6 rounded-full border"
                    style={{
                        backgroundColor: row.original.value,
                    }}
                />
            </div>
        ),
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
