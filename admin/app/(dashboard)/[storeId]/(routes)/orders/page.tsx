import prismadb from '@/lib/prismadb';
import BillboardClient from './components/client';
import { OrderColumn } from './components/column';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { formatter } from '@/lib/utils';

const OrdersPage = async ({
    params,
}: {
    params: { storeId: string };
}) => {
    const orders = await prismadb.order.findMany({
        where: { storeId: params.storeId },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
            orderStatus: true,
        },
        orderBy: { updatedAt: 'desc' },
    });

    const formattedOrders: OrderColumn[] = orders.map(
        (item) => ({
            id: item.id,
            phone: item.phone,
            address: item.address,
            products: item.orderItems
                .map((orderItem) => orderItem.product.name)
                .join(', '),
            totalPrice: formatter.format(
                item.orderItems.reduce((total, item) => {
                    return (
                        total +
                        Number(item.product.price) *
                            item.entity
                    );
                }, 0)
            ),
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
                <BillboardClient data={formattedOrders} />
            </div>
        </div>
    );
};

export default OrdersPage;
