import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Spinner from './Spinner';
import { ReactSortable } from 'react-sortablejs';

export default function ProductForm({ productInfo }) {
    const [product, setProduct] = useState({
        ...productInfo,
    });
    const [goToProduct, setGoToProduct] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [productImages, setProductImages] = useState(
        productInfo.images
    );
    const { _id } = productInfo;
    const router = useRouter();
    const onChangeProduct = (label, data) => {
        setProduct({ ...product, [label]: data });
    };

    const saveProduct = async (ev) => {
        ev.preventDefault();
        if (_id) {
            await axios.put('/api/products', product);
        } else {
            await axios.post('/api/products', product);
        }
        setGoToProduct(true);
    };

    if (goToProduct) {
        router.push('/products');
    }

    const uploadImage = async (ev) => {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            const res = await axios.post(
                '/api/upload',
                data
            );
            setProduct({
                ...product,
                images: [
                    ...productImages,
                    ...res.data.links,
                ],
            });
            setProductImages([
                ...productImages,
                ...res.data.links,
            ]);
            setIsUploading(false);
        }
    };

    const updateImagesOrder = (images) => {
        setProductImages(images);
        setProduct({ ...product, images });
    };

    return (
        <form onSubmit={saveProduct}>
            <label>Product Name</label>
            <input
                type="text"
                placeholder="product name"
                value={product.name}
                onChange={(ev) =>
                    onChangeProduct('name', ev.target.value)
                }
            />
            <label>Description</label>
            <textarea
                placeholder="decription"
                value={product.description}
                onChange={(ev) =>
                    onChangeProduct(
                        'description',
                        ev.target.value
                    )
                }
            />
            <label>Price</label>
            <input
                type="number"
                placeholder="price"
                value={product.price}
                onChange={(ev) =>
                    onChangeProduct(
                        'price',
                        ev.target.value
                    )
                }
            />
            <label>Photos</label>
            <div className="mb-2 flex flex-col flex-wrap gap-2">
                <label
                    className="w-24 h-24 border text-center 
                    flex flex-col items-center justify-center text-sm gap-1 
                    text-gray-500 rounded-md bg-gray-200 cursor-pointer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75"
                        />
                    </svg>
                    <div>Upload</div>
                    <input
                        type="file"
                        className="hidden"
                        onChange={uploadImage}
                    />
                </label>
                <div>
                    <ReactSortable
                        className="flex flex-wrap gap-1"
                        list={productImages}
                        setList={updateImagesOrder}
                    >
                        {!!productImages?.length &&
                            productImages.map((link) => (
                                <div
                                    key={link}
                                    className="h-24"
                                >
                                    <img
                                        src={link}
                                        alt=""
                                        className="rounded-lg"
                                    />
                                </div>
                            ))}
                    </ReactSortable>
                    {isUploading && (
                        <div className="h-24 flex items-center">
                            <Spinner />
                        </div>
                    )}
                    {/* {!productInfo?.images?.length && (
                        <div>No photos in this product</div>
                    )} */}
                </div>
            </div>
            <button type="submit" className="btn-primary">
                Save Product
            </button>
        </form>
    );
}
