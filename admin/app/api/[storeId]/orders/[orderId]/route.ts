import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    if (!params.orderId) {
      return new NextResponse('orderId id is required', {
        status: 400,
      });
    }

    const order = await prismadb.order.findUnique({
      where: {
        id: params.orderId,
      },
    });

    return NextResponse.json(order);
  } catch (err) {
    console.log('brand_GET', err);
    return new NextResponse('Internal error', {
      status: 500,
    });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: { params: { storeId: string; orderId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      customerName,
      address,
      phone,
      isPaid,
      orderItems,
    } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', {
        status: 401,
      });
    }

    if (!customerName) {
      return new NextResponse('customerName is required', {
        status: 400,
      });
    }

    if (!address) {
      return new NextResponse('address is required', {
        status: 400,
      });
    }

    if (!phone) {
      return new NextResponse('phone is required', {
        status: 400,
      });
    }

    if (!isPaid) {
      return new NextResponse('isPaid is required', {
        status: 400,
      });
    }

    if (!orderItems) {
      return new NextResponse('orderItems is required', {
        status: 400,
      });
    }

    if (!params.orderId) {
      return new NextResponse('orderId id is required', {
        status: 400,
      });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', {
        status: 403,
      });
    }

    await prismadb.order.update({
      where: {
        id: params.orderId,
      },
      data: {
        customerName,
        address,
        phone,
        isPaid,
        orderItems: {
          deleteMany: {},
        },
      },
    });

    const order = await prismadb.order.update({
      where: {
        id: params.orderId,
      },
      data: {
        orderItems: {
          createMany: {
            data: [
              ...orderItems.map(
                (orderItem: {
                  productId: string;
                  quantity: string;
                }) => ({
                  ...orderItem,
                  quantity: parseInt(
                    orderItem.quantity,
                    10
                  ),
                })
              ),
            ],
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (err) {
    console.log('brand_PATCH', err);
    return new NextResponse('Internal error', {
      status: 500,
    });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: { params: { storeId: string; orderId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', {
        status: 401,
      });
    }

    if (!params.orderId) {
      return new NextResponse('orderId id is required', {
        status: 400,
      });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', {
        status: 403,
      });
    }

    const order = await prismadb.order.deleteMany({
      where: {
        id: params.orderId,
      },
    });

    return NextResponse.json(order);
  } catch (err) {
    console.log('brand_DELETE', err);
    return new NextResponse('Internal error', {
      status: 500,
    });
  }
}
