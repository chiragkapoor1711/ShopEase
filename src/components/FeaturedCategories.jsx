import Image from "next/image";

const categories = [
  {
    name: "Electronics",
    image: "/categories/electronics.jpg",
  },
  {
    name: "Fashion",
    image: "/categories/fashion.jpg",
  },
  {
    name: "Footwear",
    image: "/categories/footwear.jpg",
  },
  {
    name: "Accessories",
    image: "/categories/accessories.jpg",
  },
  {
    name: "Home Decor",
    image: "/categories/home-decor.jpg",
  },
  {
    name: "Beauty",
    image: "/categories/beauty.jpg",
  },
];

export default function FeaturedCategories() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">
            Featured Categories
          </h2>

          <p className="mt-3 text-gray-600">
            Browse our most popular shopping categories.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-xl  shadow-md p-6 flex flex-col items-center cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105"
            >
              <Image
                src={category.image}
                alt={category.name}
                width={150}
                height={150}
                className="object-contain "
              />

              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                {category.name}
              </h3>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}