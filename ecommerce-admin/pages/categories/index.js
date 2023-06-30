import Layout from '@/components/Layout';
import CategoryModal from '@/components/Modal/CategoryModal';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Categories() {
    const [showAddNewModal, setShowAddNewModal] =
        useState(false);
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');

    const handleClose = () => {
        setShowAddNewModal(false);
        fetchCategories();
    };

    const fetchCategories = () => {
        axios.get('/api/categories').then((res) => {
            setCategories(res.data);
        });
    };

    const handleUpdate = (name) => {
        setCategoryName(name);
        setShowAddNewModal(true);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <Layout>
            <div className="flex justify-between items-center">
                <h1>Danh mục loại sản phẩm</h1>
                <button
                    className="bg-blue-900 rounded-md text-white py-1 px-2"
                    onClick={() => {
                        setShowAddNewModal(true);
                    }}
                >
                    Thêm mới
                </button>
            </div>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Danh mục sản phẩm</td>
                        <td>Chỉnh sửa</td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 &&
                        categories.map((category) => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>
                                    <button
                                        onClick={() =>
                                            handleUpdate(
                                                category.name
                                            )
                                        }
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={
                                                1.5
                                            }
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                                            />
                                        </svg>
                                        Chỉnh sửa
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <CategoryModal
                visible={showAddNewModal}
                onClose={handleClose}
                categoryName={categoryName}
            />
        </Layout>
    );
}
