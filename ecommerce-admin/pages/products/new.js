import Layout from '@/components/Layout';
import ProductForm from '@/components/ProductForm';

export default function NewProduct() {
    return (
        <Layout>
            <h1>New Product</h1>
            <ProductForm
                productInfo={{
                    name: '',
                    description: '',
                    price: 0,
                    images: [],
                }}
            />
        </Layout>
    );
}
