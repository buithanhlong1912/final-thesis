'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CategoryColumn } from './column';
import { Button } from '@/components/ui/button';
import {
    Copy,
    Edit,
    MoreHorizontal,
    Trash,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import AlertModal from '@/components/modals/alert-modals';

interface CellActionProps {
    data: CategoryColumn;
}

const CellAction: React.FC<CellActionProps> = ({
    data,
}) => {
    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success('ID đã được lưu vào bộ nhớ đệm!');
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(
                `/api/${params.storeId}/brands/${data.id}`
            );
            toast.success('Đã xóa thành công danh mục!');
            router.refresh();
        } catch (err) {
            toast.error(
                'Hãy chắc chắn rằng đã hóa tất cả thông tin liên quan đến danh mục này.'
            );
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
                title="Bạn có muốn xóa nhãn hàng?"
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                    >
                        <span className="sr-only">
                            Open menu
                        </span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => onCopy(data.id)}
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        Sao chép id
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() =>
                            router.push(
                                `/${params.storeId}/brands/${data.id}`
                            )
                        }
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Xóa
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default CellAction;
