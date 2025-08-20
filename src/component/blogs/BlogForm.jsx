import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { Input, DatePicker, Switch, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { IP } from "../utils/Constent";

export default function BlogForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!slug;

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    slug: "",
    tags: "",
    authorName: "",
    shortMetaDescription: "",
    content: "",
    date: dayjs(),
    isDraft: false,
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingImage, setExistingImage] = useState(null);

  // Fetch blog data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchBlog = async () => {
        try {
          const response = await axios.get(`${IP}/api/v1/blogs/${slug}`);
          const blog = response.data;

          setFormData({
            title: blog.title || "",
            category: blog.category || "",
            slug: blog.slug || "",
            tags: blog.tags?.join(",") || "",
            authorName: blog.authorName || "",
            shortMetaDescription: blog.shortMetaDescription || "",
            content: blog.content || "",
            date: blog.date ? dayjs(blog.date) : dayjs(),
            isDraft: blog.isDraft || false,
          });

          if (blog.coverImage) {
            setExistingImage(blog.coverImage);
          }
        } catch (err) {
          console.error(err);
          message.error("Failed to load blog");
          navigate("/blogs");
        }
      };
      fetchBlog();
    }
  }, [slug, isEditMode, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date }));
  };

  const handleSwitchChange = (checked) => {
    setFormData((prev) => ({ ...prev, isDraft: checked }));
  };

  const handleFileChange = (info) => {
    const fileObj = info.fileList?.[0]?.originFileObj;
    if (fileObj) {
      setFile(fileObj);
      setExistingImage(null);
    } else {
      message.error("Failed to load file.");
    }
  };

  const handleQuillChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, content: value }));
  }, []);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await axios.post(`${IP}/api/v1/upload-image`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const imageUrl = res.data.url;

        const editor = document.querySelector(".ql-editor");
        const range = window.getSelection().getRangeAt(0);
        const img = document.createElement("img");
        img.src = imageUrl;
        range.insertNode(img);
      } catch (err) {
        console.error("Image upload failed", err);
      }
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [imageHandler]
  );

  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "link",
      "image",
    ],
    []
  );

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      message.error("Title and content are required");
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("category", formData.category);
    payload.append("slug", formData.slug);
    payload.append("tags", formData.tags);
    payload.append("authorName", formData.authorName);
    payload.append("shortMetaDescription", formData.shortMetaDescription);
    payload.append("content", formData.content);
    payload.append("date", formData.date.toISOString());
    payload.append("isDraft", formData.isDraft.toString());

    if (file) {
      payload.append("coverImage", file);
    } else if (isEditMode && !existingImage) {
      payload.append("removeImage", "true");
    }

    try {
      setLoading(true);
      if (isEditMode) {
        await axios.put(`${IP}/api/v1/blogs/${slug}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Blog updated successfully!");
      } else {
        await axios.post(`${IP}/api/v1/blogs`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Blog created successfully!");
      }
      navigate("/admin/blog/list");
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message ||
        (isEditMode ? "Failed to update blog" : "Failed to create blog");
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-xl shadow-lg space-y-4">
      <h2 className="text-2xl font-semibold mb-4">
        {isEditMode ? "Edit Blog Post" : "Create Blog Post"}
      </h2>
      <div className="space-y-4">
        <Input
          placeholder="Title*"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <Input
          placeholder="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
        <Input
          placeholder="Slug (url-safe)"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
        />
        <Input
          placeholder="Tags (comma-separated)"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
        />
        <Input
          placeholder="Author Name"
          name="authorName"
          value={formData.authorName}
          onChange={handleChange}
        />
        <Input
          placeholder="Short Meta Description"
          name="shortMetaDescription"
          value={formData.shortMetaDescription}
          onChange={handleChange}
        />

        <div className="h-full">
          <label className="block mb-2 font-medium">Blog Content*</label>
          <div className="h-[400px] mb-12">
            <ReactQuill
              value={formData.content}
              onChange={handleQuillChange}
              className="h-[300px]"
              theme="snow"
              modules={modules}
              formats={formats}
              placeholder="Write your content here..."
            />
          </div>
        </div>

        <DatePicker
          className="w-full"
          value={formData.date}
          onChange={handleDateChange}
        />

        <div className="flex items-center space-x-4">
          <span>Is Draft?</span>
          <Switch checked={formData.isDraft} onChange={handleSwitchChange} />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Cover Image</label>
          {existingImage && !file && (
            <div className="mb-2">
              <img
                src={existingImage}
                alt="Current cover"
                className="max-h-40 rounded"
              />
              <p className="text-sm text-gray-500 mt-1">Current image</p>
            </div>
          )}
          <Upload
            beforeUpload={() => false}
            onChange={handleFileChange}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>
              {existingImage ? "Change Image" : "Upload Cover Image"}
            </Button>
          </Upload>

          {existingImage && (
            <Button
              danger
              type="text"
              size="small"
              onClick={() => {
                setFile(null);
                setExistingImage(null);
              }}
            >
              Remove Image
            </Button>
          )}
        </div>

        <Button
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={!formData.title || !formData.content}
        >
          {isEditMode ? "Update Blog" : "Create Blog"}
        </Button>
      </div>
    </div>
  );
}
