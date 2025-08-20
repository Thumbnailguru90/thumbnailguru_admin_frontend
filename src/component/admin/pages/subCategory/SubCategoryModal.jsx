import React from "react";
import { Modal, Divider } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import SubCategoryForm from "./SubCategoryForm";

const SubCategoryModal = ({
  isModalVisible,
  setIsModalVisible,
  editingSubCategory,
  form,
  handleSubmit,
  categories,
  selectedCategory,
  handleCategoryChange,
  subCategories,
  getParentOptions,
}) => {
  return (
    <Modal
      title={
        <span>
          {editingSubCategory ? (
            <>
              <EditOutlined /> Edit SubCategory
            </>
          ) : (
            <>
              <PlusOutlined /> Add SubCategory
            </>
          )}
        </span>
      }
      open={isModalVisible}
      onCancel={() => {
        setIsModalVisible(false);
        form.resetFields();
      }}
      footer={null}
      width={700}
      destroyOnClose
    >
      <SubCategoryForm
        form={form}
        handleSubmit={handleSubmit}
        editingSubCategory={editingSubCategory}
        categories={categories}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
        subCategories={subCategories}
        getParentOptions={getParentOptions}
        setIsModalVisible={setIsModalVisible}
      />
    </Modal>
  );
};

export default SubCategoryModal;
