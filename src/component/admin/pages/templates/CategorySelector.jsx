const CategorySelector = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  setSelectedSubCategory,
}) => {
  return (
    <div className="mb-6 flex gap-4 flex-wrap justify-center">
      <button
        onClick={() => {
          setSelectedCategory("All");
          setSelectedSubCategory(null);
        }}
        className={`px-4 py-2 rounded-lg transition-all duration-300 ease-in-out ${
          selectedCategory === "All"
            ? "bg-blue-600 text-white shadow-md transform scale-105"
            : "bg-white text-blue-600  hover:bg-blue-600 hover:text-white hover:shadow-lg"
        } text-sm font-medium`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => {
            setSelectedCategory(cat._id);
            setSelectedSubCategory(null);
          }}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ease-in-out ${
            selectedCategory === cat._id
              ? "bg-blue-600 text-white shadow-md transform scale-105"
              : "bg-white text-black-600  hover:bg-blue-600 hover:text-white hover:shadow-lg"
          } text-sm font-medium`}
        >
          {cat.categoryName}
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;
