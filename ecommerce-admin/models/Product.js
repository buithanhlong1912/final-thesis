import { Category } from './Category';

const {
    Schema,
    model,
    models,
    default: mongoose,
} = require('mongoose');

const ProductSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    images: [{ type: String }],
    price: { type: Number, required: true },
    category: {
        type: mongoose.Types.ObjectId,
        ref: Category,
    },
    countInStock: Number,
});

export const Product =
    models.Product || model('Product', ProductSchema);
