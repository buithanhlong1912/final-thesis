import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductForm() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
  });
  const [goToProduct, setGoToProduct] = useState(false);
  const router = useRouter();
  //   const [description, setDescription] = useState("");
  //   const [price, setPrice] = useState(0);

  const onChangeProduct = (label, data) => {
    setProduct({ ...product, [label]: data });
  };

  const createProduct = async (ev) => {
    ev.preventDefault();
    const data = product;
    await axios.post("../api/products", data);
    setGoToProduct(true);
  };

  if (goToProduct) {
    router.push("/products");
  }

  return (
    <form onSubmit={createProduct}>
      <h1>New Product</h1>
      <label>Product Name</label>
      <input
        type="text"
        placeholder="product name"
        value={product.name}
        onChange={(ev) => onChangeProduct("name", ev.target.value)}
      />
      <label>Description</label>
      <textarea
        placeholder="decription"
        value={product.description}
        onChange={(ev) => onChangeProduct("description", ev.target.value)}
      />
      <label>Price</label>
      <input
        type="number"
        placeholder="price"
        value={product.price}
        onChange={(ev) => onChangeProduct("price", ev.target.value)}
      />
      <button type="submit" className="btn-primary">
        Add Product
      </button>
    </form>
  );
}
