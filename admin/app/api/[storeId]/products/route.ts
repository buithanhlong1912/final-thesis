import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
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

        if (!params.storeId) {
            return new NextResponse(
                'Store id is required',
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

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                categoryId,
                brandId,
                colorId,
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
                isFeatured,
                isArchived,
                storeId: params.storeId,
            },
        });

        return NextResponse.json(product);
    } catch (err) {
        console.log('product_POST', err);
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
        const { searchParams } = new URL(req.url);
        const categoryId =
            searchParams.get('categoryId') || undefined;
        const colorId =
            searchParams.get('colorId') || undefined;
        const brandId =
            searchParams.get('brandId') || undefined;
        const isFeatured = searchParams.get('isFeatured');

        if (!params.storeId) {
            return new NextResponse(
                'Store id is required',
                {
                    status: 400,
                }
            );
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                brandId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false,
            },
            include: {
                images: true,
                category: true,
                brand: true,
                color: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });

        return NextResponse.json(products);
    } catch (err) {
        console.log('products_GET', err);
        return new NextResponse('Internal error', {
            status: 500,
        });
    }
}
