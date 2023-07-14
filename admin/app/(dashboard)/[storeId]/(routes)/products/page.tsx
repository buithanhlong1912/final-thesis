import prismadb from '@/lib/prismadb';
import ProductClient from './components/client';
import { ProductColumn } from './components/column';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { formatter } from '@/lib/utils';

const ProductsPage = async ({
    params,
}: {
    params: { storeId: string };
}) => {
    const products = await prismadb.product.findMany({
        where: { storeId: params.storeId },
        include: {
            category: true,
            brand: true,
            color: true,
        },
        orderBy: { updatedAt: 'desc' },
    });

    const formattedProducts: ProductColumn[] = products.map(
        (item) => ({
            id: item.id,
            name: item.name,
            isFeatured: item.isFeatured,
            isArchived: item.isArchived,
            price: formatter.format(item.price.toNumber()),
            category: item.category.name,
            brand: item.brand.name,
            color: item.color.value,
            updatedAt: format(
                item.updatedAt,
                'do MMMM, yyyy',
                { locale: vi }
            ),
        })
    );

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts} />
            </div>
        </div>
    );
};

export default ProductsPage;
