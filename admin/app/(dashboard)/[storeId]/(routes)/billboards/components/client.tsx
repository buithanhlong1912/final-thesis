'use client';

import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { BillboardColumn, columns } from './column';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';

interface BillboardClientProps {
    data: BillboardColumn[];
}

const BillboardClient: React.FC<BillboardClientProps> = ({
    data,
}) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Ảnh bìa (${data.length})`}
                    description="Quản lý ảnh bìa cho cửa hàng"
                />
                <Button
                    onClick={() =>
                        router.push(
                            `/${params.storeId}/billboards/new`
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
                searchKey="label"
            />
        </>
    );
};

export default BillboardClient;
