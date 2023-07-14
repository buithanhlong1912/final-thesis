'use client';

import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { ColorColumn, columns } from './column';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';

interface ColorClientProps {
    data: ColorColumn[];
}

const ColorClient: React.FC<ColorClientProps> = ({
    data,
}) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Màu sắc (${data.length})`}
                    description="Quản lý danh sách màu sắc sản phẩm cho cửa hàng"
                />
                <Button
                    onClick={() =>
                        router.push(
                            `/${params.storeId}/colors/new`
                        )
                    }
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm mới
                </Button>
            </div>
            <Separator />
            <DataTable
                columns={columns}
                data={data}
                searchKey="name"
            />
        </>
    );
};

export default ColorClient;
