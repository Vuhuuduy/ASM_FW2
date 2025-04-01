import { Table, Button, InputNumber, Space, Typography, Card, Row, Col, Divider, Empty, message, Badge, Tag } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, ArrowLeftOutlined, CreditCardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const { Title, Text } = Typography;

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  // Lấy dữ liệu giỏ hàng từ database
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        // 1. Lấy giỏ hàng từ database
        const cartResponse = await axios.get(`http://localhost:3000/carts?userId=${user.id}`);
        
        // 2. Lấy thông tin chi tiết sản phẩm
        const itemsWithDetails = await Promise.all(
          cartResponse.data.map(async (cartItem) => {
            const productRes = await axios.get(`http://localhost:3000/products/${cartItem.productId}`);
            return {
              ...cartItem,
              ...productRes.data,
              id: cartItem.productId, // Để phù hợp với các xử lý hiện tại
              quantity: cartItem.quantity
            };
          })
        );

        setCartItems(itemsWithDetails);
      } catch (error) {
        console.error('Error fetching cart:', error);
        message.error('Không thể tải giỏ hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, navigate]);

  // Tính tổng tiền
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(total);
  }, [cartItems]);

  // Cập nhật số lượng (chỉ trong database)
  const handleQuantityChange = async (productId, value) => {
    try {
      // 1. Tìm cart item trong database
      const { data } = await axios.get(
        `http://localhost:3000/carts?userId=${user.id}&productId=${productId}`
      );
      
      if (data.length > 0) {
        // 2. Cập nhật trong database
        await axios.patch(`http://localhost:3000/carts/${data[0].id}`, {
          quantity: value
        });
        
        // 3. Cập nhật state local
        setCartItems(prev => prev.map(item => 
          item.productId === productId ? { ...item, quantity: value } : item
        ));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      message.error('Cập nhật số lượng thất bại');
    }
  };

  // Xóa sản phẩm (chỉ trong database)
  const handleRemoveItem = async (productId) => {
    try {
      // 1. Tìm cart item trong database
      const { data } = await axios.get(
        `http://localhost:3000/carts?userId=${user.id}&productId=${productId}`
      );
      
      if (data.length > 0) {
        // 2. Xóa từ database
        await axios.delete(`http://localhost:3000/carts/${data[0].id}`);
        
        // 3. Cập nhật state local
        setCartItems(prev => prev.filter(item => item.productId !== productId));
        
        message.success('Đã xóa sản phẩm');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      message.error('Xóa sản phẩm thất bại');
    }
  };

  // Thanh toán
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.warning('Giỏ hàng trống');
      return;
    }
    navigate('/checkout', { state: { cartItems, subtotal } });
  };

  // Cột bảng
  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <img 
            src={record.imageUrl}
            alt={text} 
            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
          />
          <div>
            <Text strong>{text}</Text>
            <div style={{ marginTop: 4 }}>
              <Tag color={record.available ? 'green' : 'red'}>
                {record.available ? 'Còn hàng' : 'Hết hàng'}
              </Tag>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (price) => <Text>{price.toLocaleString()}₫</Text>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (quantity, record) => (
        <InputNumber
          min={1}
          max={record.available ? 100 : 0}
          value={quantity}
          onChange={(value) => handleQuantityChange(record.productId || record.id, value)}
          disabled={!record.available}
        />
      ),
    },
    {
      title: 'Thành tiền',
      key: 'total',
      align: 'right',
      render: (_, record) => (
        <Text type="danger" strong>
          {(record.price * record.quantity).toLocaleString()}₫
        </Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button 
          danger 
          type="text" 
          icon={<DeleteOutlined />} 
          onClick={() => handleRemoveItem(record.productId || record.id)}
        />
      ),
    },
  ];

  if (loading) {
    return <div style={{ padding: 24, textAlign: 'center' }}>Đang tải giỏ hàng...</div>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        style={{ marginBottom: 24 }}
      >
        Tiếp tục mua sắm
      </Button>

      <Title level={3} style={{ marginBottom: 24 }}>
        <ShoppingCartOutlined /> Giỏ hàng của bạn
        <Badge 
          count={cartItems.reduce((total, item) => total + item.quantity, 0)} 
          style={{ backgroundColor: '#ee4d2d', marginLeft: 8 }} 
        />
      </Title>

      {cartItems.length === 0 ? (
        <Card bordered={false}>
          <Empty
            description={<Text>Giỏ hàng của bạn đang trống</Text>}
            imageStyle={{ height: 100 }}
          >
            <Button type="primary" onClick={() => navigate('/products')}>
              Mua sắm ngay
            </Button>
          </Empty>
        </Card>
      ) : (
        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <Table
              columns={columns}
              dataSource={cartItems}
              rowKey="id"
              pagination={false}
              scroll={{ x: 800 }}
            />
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Tóm tắt đơn hàng" bordered>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Row justify="space-between">
                  <Text>Tạm tính:</Text>
                  <Text>{subtotal.toLocaleString()}₫</Text>
                </Row>
                <Row justify="space-between">
                  <Text>Phí vận chuyển:</Text>
                  <Text>0₫</Text>
                </Row>
                <Divider />
                <Row justify="space-between">
                  <Text strong>Tổng cộng:</Text>
                  <Text type="danger" strong>{subtotal.toLocaleString()}₫</Text>
                </Row>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleCheckout}
                  icon={<CreditCardOutlined />}
                  style={{ marginTop: 16, background: '#ee4d2d', borderColor: '#ee4d2d' }}
                >
                  Thanh toán
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default CartPage;