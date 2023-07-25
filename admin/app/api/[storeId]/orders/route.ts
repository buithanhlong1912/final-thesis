import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods':
    'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();

    const {
      customerName,
      address,
      phone,
      isPaid,
      orderItems,
    } = body;

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

    if (!orderItems) {
      return new NextResponse('orderItems is required', {
        status: 400,
      });
    }

    if (!params.storeId) {
      return new NextResponse('Store id is required', {
        status: 400,
      });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', {
        status: 403,
      });
    }

    const order = await prismadb.order.create({
      data: {
        customerName,
        address,
        phone,
        isPaid,
        storeId: params.storeId,
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

    return NextResponse.json(order, {
      headers: corsHeaders,
    });
  } catch (err) {
    console.log('CATEGORY_POST', err);
    return new NextResponse('Internal error', {
      status: 500,
    });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse('Store id is required', {
        status: 400,
      });
    }

    const orders = await prismadb.order.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(orders);
  } catch (err) {
    console.log('BILLBOARD_GET', err);
    return new NextResponse('Internal error', {
      status: 500,
    });
  }
}
