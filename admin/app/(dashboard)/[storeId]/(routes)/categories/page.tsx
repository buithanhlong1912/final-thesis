import prismadb from '@/lib/prismadb';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CategoryColumn } from './components/column';
import CategoryClient from './components/client';

const CategoriesPage = async ({
    params,
}: {
    params: { storeId: string };
}) => {
    const categories = await prismadb.category.findMany({
        where: { storeId: params.storeId },
        orderBy: { updatedAt: 'desc' },
    });

    const formattedCategories: CategoryColumn[] =
        categories.map((item) => ({
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
                <CategoryClient
                    data={formattedCategories}
                />
            </div>
        </div>
    );
};

export default CategoriesPage;
