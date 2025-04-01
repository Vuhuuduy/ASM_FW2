import React from "react";
import { Button, Image, message, Popconfirm, Skeleton, Space, Table, Tag } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductManagement = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Xóa sản phẩm
  const { mutate: deleteProduct } = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`http://localhost:3000/products/${id}`);
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Xóa sản phẩm thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Xóa sản phẩm thất bại",
      });
    },
  });

  // Lấy danh sách sản phẩm
  const { isLoading, data } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/products");
      return response.data.map((product) => ({ ...product, key: product.id }));
    },
  });

  // Cột hiển thị trong bảng
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Ảnh sản phẩm",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (_, item) => <Image width={50} src={item.imageUrl} />,
    },
    {
      title: "Tình trạng",
      key: "available",
      dataIndex: "available",
      render: (_, item) => (
        item.available ? <Tag color="green">Còn hàng</Tag> : <Tag color="red">Hết hàng</Tag>
      ),
    },
    {
      title: "Danh mục",
      key: "category",
      dataIndex: "category",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, item) => (
        <Space>
          {/* Nút chỉnh sửa */}
          <Button type="primary" onClick={() => navigate(`/admin/products/edit/${item.id}`)}>
            Edit
          </Button>

          {/* Nút xóa */}
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => deleteProduct(item.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <h1>Quản lý sản phẩm</h1>
      {isLoading ? <Skeleton active /> : <Table columns={columns} dataSource={data} />}
    </>
  );
};

export default ProductManagement;
