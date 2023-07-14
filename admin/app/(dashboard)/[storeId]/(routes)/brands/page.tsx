import prismadb from '@/lib/prismadb';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CategoryColumn } from './components/column';
import BrandClient from './components/client';

const BrandPage = async ({
    params,
}: {
    params: { storeId: string };
}) => {
    const brands = await prismadb.brand.findMany({
        where: { storeId: params.storeId },
        orderBy: { updatedAt: 'desc' },
    });

    const formattedCategories: CategoryColumn[] =
        brands.map((item) => ({
            id: item.id,
            name: item.name,
            updatedAt: format(
                item.updatedAt,
                'do MMMM, yyyy',
                { locale: vi }
            ),
        }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BrandClient data={formattedCategories} />
            </div>
        </div>
    );
};

export default BrandPage;
