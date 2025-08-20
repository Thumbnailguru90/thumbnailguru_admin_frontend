import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Pagination, Modal, Input, Typography } from "antd";
import SearchBar from "../../component/admin/pages/templates/SearchBar"
import TemplatesGrid from "../../component/admin/pages/templates/TemplatesGrid";
import { templateApiService } from "../../component/admin/pages/templates/services/templateApiService";
import SubcategoryTree from "../../component/admin/pages/templates/SubcategoryTree";
import CategorySelector from "../../component/admin/pages/templates/CategorySelector";

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await templateApiService.fetchCategories();

        setCategories(data);
      } catch (error) {
        message.error(error.message);
      }
    };
    loadCategories();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const role = localStorage.getItem("role");
      const userId = localStorage.getItem("userID");
      const params = {
        page: currentPage,
        limit,
      };

      if (searchTerm) params.searchTerm = searchTerm;
      if (selectedSubCategory) params.subCategoryId = selectedSubCategory;
      else if (selectedCategory !== "All") params.category = selectedCategory;

      // ✅ Add userId only if role is admin
      if (role === "subadmin" && userId) {
        params.userId = userId;
      }

      const response = await templateApiService.fetchTemplates(params);
      console.log(response);
      setTemplates(response.templates);
      setTotalPages(response.totalPages);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubCategory, searchTerm]);

  useEffect(() => {
    fetchTemplates();
  }, [selectedCategory, selectedSubCategory, currentPage, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setSelectedSubCategory(null);
    setSelectedCategory("All");
  };

  const handleTemplateClick = (template) => {
    const lastSubCategoryId =
      template.subCategories?.[template.subCategories.length - 1]?._id;
    console.log(template.subCategories);
    navigate(
      `/subadmin/editor/${template._id}?subCategoryId=${lastSubCategoryId}`
    );
  };

  const handleDeleteTemplate = async (template) => {
    console.log(template);
    Modal.confirm({
      title: `Delete Template`,
      content: (
        <div>
          <Typography.Paragraph>
            To confirm deletion, please type the template name:
            <Typography.Text copyable className="ml-1">
              {template.name}
            </Typography.Text>
          </Typography.Paragraph>
          <Input
            id="confirm-template-name-input"
            placeholder="Type template name"
          />
        </div>
      ),
      okText: "Delete",
      cancelText: "Cancel",
      onOk: async () => {
        const input = document.getElementById(
          "confirm-template-name-input"
        ).value;
        if (input === template.name) {
          try {
            await templateApiService.deleteTemplate(template._id);
            message.success("Template deleted successfully");
            fetchTemplates();
          } catch (error) {
            message.error(error.message);
          }
        } else {
          message.error("Template name does not match. Deletion cancelled.");
          throw new Error("Name mismatch");
        }
      },
    });
  };

  return (
    <div className="p-6 mt-7 flex flex-col gap-5">
      <div>
        <div className="mb-4 flex gap-4 items-center">
          <SearchBar onSearch={handleSearch} />
        </div>

        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setSelectedSubCategory={setSelectedSubCategory}
        />

        {selectedCategory !== "All" && (
          <SubcategoryTree
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedSubCategory={setSelectedSubCategory}
          />
        )}
      </div>

      <div className="mt-8">
        <TemplatesGrid
          templates={templates}
          loading={loading}
          onDelete={handleDeleteTemplate}
          onClick={handleTemplateClick}
          fetchTemplates={fetchTemplates}
        />
      </div>

      <div className="flex justify-center mt-6">
        <Pagination
          current={currentPage}
          total={totalPages * limit}
          pageSize={limit}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default TemplateList;
