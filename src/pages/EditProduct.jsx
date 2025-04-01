import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, InputNumber, Select, Switch, Upload, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

const EditProduct = () => {
  const [imageUrl, setImageUrl] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  if (!id) return <p>Lỗi: Không tìm thấy sản phẩm</p>;

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id], 
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/products/${id}`);
      if (!res.data) throw new Error("Không tìm thấy sản phẩm!");
      setImageUrl(res.data.imageUrl || "");
      return res.data;
    },
  });
  const { mutate } = useMutation({
    mutationFn: async (updatedProduct) => {
      await axios.put(`http://localhost:3000/products/${id}`, updatedProduct);
    },
    onSuccess: () => {
      messageApi.success("Cập nhật sản phẩm thành công!");
      navigate("/admin/products");
    },
    onError: () => {
      messageApi.error("Cập nhật sản phẩm thất bại!");
    },
  });

  const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);
  const onUploadChange = (info) => {
    if (info.file.status === "done") {
      setImageUrl(info.file.response.secure_url);
    }
  };

  const onFinish = (values) => {
    mutate({ 
      ...values, 
      imageUrl: imageUrl || product?.imageUrl, 
      available: values.available ? 1 : 0 
    });
  };

  return (
    <div>
      {contextHolder}
      <h1 className="text-4xl my-8">Chỉnh sửa sản phẩm</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Form
          name="edit-form"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          initialValues={product}
        >
          <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Giá sản phẩm" name="price" rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm" }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload
              action="https://api.cloudinary.com/v1_1/dxhgeg7vi/image/upload"
              listType="picture-card"
              data={{ upload_preset: "upload-demo" }}
              onChange={onUploadChange}
            >
              <button style={{ border: 0, background: "none" }} type="button">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </button>
            </Upload>
          </Form.Item>
          <Form.Item label="Trạng thái" name="available" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Danh mục" name="category">
            <Select>
              <Select.Option value="cate1">Danh mục 1</Select.Option>
              <Select.Option value="cate2">Danh mục 2</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật sản phẩm
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default EditProduct;

