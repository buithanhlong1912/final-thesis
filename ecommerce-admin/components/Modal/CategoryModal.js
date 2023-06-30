import axios from 'axios';
import { useEffect, useState } from 'react';

export default function CategoryModal({
    visible,
    onClose,
    categoryName,
}) {
    const [name, setName] = useState(categoryName || '');

    console.log('nam', { name, categoryName });

    const handleClose = () => {
        setName('');
        onClose();
    };

    const saveCategory = async (ev) => {
        ev.preventDefault();
        await axios.post('/api/categories', { name });
        setName('');
        onClose();
    };

    if (!visible) return null;

    return (
        <div
            id="authentication-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center "
        >
            <div className="relative w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <button
                        type="button"
                        className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                        data-modal-hide="authentication-modal"
                        onClick={handleClose}
                    >
                        <svg
                            aria-hidden="true"
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span className="sr-only">
                            Close modal
                        </span>
                    </button>
                    <div className="px-6 py-6 lg:px-8">
                        <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                            {categoryName.length > 0
                                ? 'Tạo mới danh mục sản phẩm'
                                : 'Cập nhật danh mục sản phẩm'}
                        </h3>
                        <form
                            className="space-y-6"
                            onSubmit={saveCategory}
                        >
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Tên danh mục sản phẩm
                                </label>
                                <input
                                    type="ext"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    value={name}
                                    onChange={(ev) =>
                                        setName(
                                            ev.target.value
                                        )
                                    }
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                {categoryName.length > 0
                                    ? 'Tạo'
                                    : 'Cập nhật'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
