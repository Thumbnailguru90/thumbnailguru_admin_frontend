import React, { useState } from "react";
import { Button, Modal } from "antd";
import UploadForm from "./UploadForm";
import UploadList from "./UploadList";
import "antd/dist/reset.css"; // Make sure antd styles are included

const UploadManager = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Upload Manager</h1>

      <div className="mb-4">
        <Button type="primary" onClick={showModal}>
          Add Upload
        </Button>
      </div>

      <div className="lg:col-span-3">
        <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
        <UploadList key={refreshKey} onUploadSuccess={handleUploadSuccess} />
      </div>

      <Modal
        title="Upload File"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null} // You can add custom buttons here if needed
      >
        <UploadForm onSuccess={handleUploadSuccess} />
      </Modal>
    </div>
  );
};

export default UploadManager;
