import getBrands from "@/actions/get-brands";
import getCategory from "@/actions/get-category";
import getColors from "@/actions/get-colors";
import getProducts from "@/actions/get-products";
import Billboard from "@/components/Billboard";
import Container from "@/components/ui/Container";
import Filter from "./components/filter";
import NoResult from "@/components/ui/NoResult";
import ProductCard from "@/components/ui/ProductCard";
import MobileFilters from "./components/mobile-filters";

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
  searchParams: {
    colorId: string;
    brandId: string;
  };
}

const CategoryPage: React.FC<CategoryPageProps> = async ({
  searchParams,
  params,
}) => {
  const products = await getProducts({
    categoryId: params.categoryId,
    brandId: searchParams.brandId,
    colorId: searchParams.colorId,
  });
  const brands = await getBrands();
  const colors = await getColors();
  return (
    <div className="bg-white">
      <Container>
        <div className="p-4 sm:p-6 lg:p-8 rounded-xl overflow-hidden px-4 sm:px-6 lg:px-8 pb-24">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            <MobileFilters brands={brands} colors={colors} />
            <div className="hidden lg:block">
              <Filter valueKey="brandId" name="Thương hiệu" data={brands} />
              <Filter valueKey="colorId" name="Màu sắc" data={colors} />
            </div>
            <div className="mt-6 lg:col-span-4 lg:mt-0">
              {products.length === 0 && <NoResult />}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((item) => (
                  <ProductCard key={item.id} data={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CategoryPage;
