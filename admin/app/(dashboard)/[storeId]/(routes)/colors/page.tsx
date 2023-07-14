import prismadb from '@/lib/prismadb';
import ColorClient from './components/client';
import { ColorColumn } from './components/column';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const ColorsPage = async ({
    params,
}: {
    params: { storeId: string };
}) => {
    const colors = await prismadb.color.findMany({
        where: { storeId: params.storeId },
        orderBy: { createdAt: 'desc' },
    });

    const formattedColors: ColorColumn[] = colors.map(
        (item) => ({
            id: item.id,
            name: item.name,
            value: item.value,
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
                <ColorClient data={formattedColors} />
            </div>
        </div>
    );
};

export default ColorsPage;
