'use client';

import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { OrderColumn, columns } from './column';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';

interface OrderClientProps {
    data: OrderColumn[];
}

const OrderClient: React.FC<OrderClientProps> = ({
    data,
}) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Đơn hàng (${data.length})`}
                    description="Quản lý đơn hàng hiện tại của cửa hàng"
                />
                <Button
                    onClick={() =>
                        router.push(
                            `/${params.storeId}/orders/new`
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

export default OrderClient;
