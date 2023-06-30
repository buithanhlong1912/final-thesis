import axios from 'axios';

export const getCategoryName = async (id) => {
    const { data: categories } = await axios.get(
        '/api/categories'
    );
    // console.log(categories)
    const categoryName = categories.filter(
        (c) => c._id === id
    ).name;
    console.log(categoryName);
    return <span></span>;
};
