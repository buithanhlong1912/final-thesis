import prismadb from '@/lib/prismadb';
import OrderForm from './components/OrderForm';

const BillboardPage = async ({
  params,
}: {
  params: { storeId: string; orderId: string };
}) => {
  const orders = await prismadb.order.findUnique({
    where: {
      id: params.orderId,
    },
    include: {
      orderItems: true,
    },
  });

  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderForm
          initialData={orders}
          products={products}
        />
      </div>
    </div>
  );
};

export default BillboardPage;
