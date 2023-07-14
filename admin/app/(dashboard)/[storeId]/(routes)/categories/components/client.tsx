'use client';

import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { CategoryColumn, columns } from './column';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';

interface CategoryClientProps {
    data: CategoryColumn[];
}

const CategoryClient: React.FC<CategoryClientProps> = ({
    data,
}) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Danh mục (${data.length})`}
                    description="Quản lý danh mục sản phẩm của cửa hàng"
                />
                <Button
                    onClick={() =>
                        router.push(
                            `/${params.storeId}/categories/new`
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

export default CategoryClient;
