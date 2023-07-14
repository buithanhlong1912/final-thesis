import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(
    req: Request,
    { params }: { params: { productId: string } }
) {
    try {
        if (!params.productId) {
            return new NextResponse(
                'product id is required',
                {
                    status: 400,
                }
            );
        }

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                category: true,
                images: true,
                brand: true,
                color: true,
            },
        });

        return NextResponse.json(product);
    } catch (err) {
        console.log('product_GET', err);
        return new NextResponse('Internal error', {
            status: 500,
        });
    }
}

export async function PATCH(
    req: Request,
    {
        params,
    }: { params: { storeId: string; productId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const {
            name,
            price,
            categoryId,
            brandId,
            colorId,
            images,
            isFeatured,
            isArchived,
        } = body;

        if (!userId) {
            return new NextResponse('Unauthenticated', {
                status: 401,
            });
        }

        if (!name) {
            return new NextResponse('Name is required', {
                status: 400,
            });
        }

        if (!price) {
            return new NextResponse('Price is required', {
                status: 400,
            });
        }

        if (!categoryId) {
            return new NextResponse(
                'categoryId is required',
                {
                    status: 400,
                }
            );
        }

        if (!brandId) {
            return new NextResponse('brandId is required', {
                status: 400,
            });
        }

        if (!colorId) {
            return new NextResponse('colorId is required', {
                status: 400,
            });
        }

        if (!images || !images.length) {
            return new NextResponse('images are required', {
                status: 400,
            });
        }

        if (!params.productId) {
            return new NextResponse(
                'product id is required',
                {
                    status: 400,
                }
            );
        }

        const storeByUserId =
            await prismadb.store.findFirst({
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

        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                categoryId,
                brandId,
                colorId,
                images: {
                    deleteMany: {},
                },
                isFeatured,
                isArchived,
            },
        });

        const product = await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map(
                                (image: { url: string }) =>
                                    image
                            ),
                        ],
                    },
                },
            },
        });

        return NextResponse.json(product);
    } catch (err) {
        console.log('product_PATCH', err);
        return new NextResponse('Internal error', {
            status: 500,
        });
    }
}

export async function DELETE(
    req: Request,
    {
        params,
    }: { params: { storeId: string; productId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthenticated', {
                status: 401,
            });
        }

        if (!params.productId) {
            return new NextResponse(
                'product id is required',
                {
                    status: 400,
                }
            );
        }

        const storeByUserId =
            await prismadb.store.findFirst({
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

        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            },
        });

        return NextResponse.json(product);
    } catch (err) {
        console.log('product_DELETE', err);
        return new NextResponse('Internal error', {
            status: 500,
        });
    }
}
