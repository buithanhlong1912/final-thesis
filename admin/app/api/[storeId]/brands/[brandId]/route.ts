import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(
    req: Request,
    { params }: { params: { brandId: string } }
) {
    try {
        if (!params.brandId) {
            return new NextResponse(
                'brandId id is required',
                {
                    status: 400,
                }
            );
        }

        const brand = await prismadb.brand.findUnique({
            where: {
                id: params.brandId,
            },
        });

        return NextResponse.json(brand);
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
    }: { params: { storeId: string; brandId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name } = body;

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

        if (!params.brandId) {
            return new NextResponse(
                'brandId id is required',
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

        const brand = await prismadb.brand.updateMany({
            where: {
                id: params.brandId,
            },
            data: {
                name,
            },
        });

        return NextResponse.json(brand);
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
    }: { params: { storeId: string; brandId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthenticated', {
                status: 401,
            });
        }

        if (!params.brandId) {
            return new NextResponse(
                'brandId id is required',
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

        const brand = await prismadb.brand.deleteMany({
            where: {
                id: params.brandId,
            },
        });

        return NextResponse.json(brand);
    } catch (err) {
        console.log('brand_DELETE', err);
        return new NextResponse('Internal error', {
            status: 500,
        });
    }
}
