import { Tree } from "antd";

const SubcategoryTree = ({
  categories,
  selectedCategory,
  setSelectedSubCategory,
}) => {
  const buildSubCategoryTree = (subCategories) =>
    subCategories?.map((sub) => ({
      title: sub.subCategoryName,
      key: sub._id,
      children: buildSubCategoryTree(sub.children || []),
    }));

  return (
    <div className="mb-4 w-full md:w-1/3">
      <Tree
        showLine
        onSelect={(keys) => {
          setSelectedSubCategory(keys[0]);
        }}
        treeData={buildSubCategoryTree(
          categories.find((cat) => cat._id === selectedCategory)
            ?.subCategories || []
        )}
      />
    </div>
  );
};

export default SubcategoryTree;
