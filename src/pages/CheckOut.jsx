import { Form, Input, Button, Card, Typography, Row, Col, Divider, Radio, message, Space } from 'antd';
import { ArrowLeftOutlined, CreditCardOutlined, DollarOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState } from 'react';

const { Title, Text } = Typography;

const CheckoutPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);

  const { cartItems = [], subtotal = 0 } = location.state || {};

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const orderData = {
        customerInfo: values,
        paymentMethod,
        items: cartItems,
        total: subtotal,
        status: 'pending'
      };
  
      // Gọi API để tạo đơn hàng
      // await axios.post('/api/orders', orderData);
      
      message.success('Đặt hàng thành công!');
      
      // Xóa các sản phẩm đã thanh toán khỏi giỏ hàng
      const currentCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const updatedCart = currentCart.filter(
        item => !cartItems.some(orderedItem => orderedItem.id === item.id)
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      
      navigate('/order-success', { state: { orderId: '12345' } });
    } catch (error) {
      message.error('Đặt hàng thất bại!');
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Title level={4}>Giỏ hàng trống</Title>
        <Button type="primary" onClick={() => navigate('/')}>
          Quay lại mua sắm
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: 1200, margin: '0 auto' }}>
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        style={{ marginBottom: 20 }}
      >
        Quay lại
      </Button>

      <Title level={2} style={{ marginBottom: 24 }}>Thông tin thanh toán</Title>

      <Row gutter={24}>
        <Col xs={24} md={14}>
          <Card title="Thông tin khách hàng" bordered>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                name: '',
                phone: '',
                address: '',
                note: ''
              }}
            >
              <Form.Item
                label="Họ và tên"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              >
                <Input placeholder="Nguyễn Văn A" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                  { pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/, message: 'Số điện thoại không hợp lệ' }
                ]}
              >
                <Input placeholder="0987654321" />
              </Form.Item>

              <Form.Item
                label="Địa chỉ nhận hàng"
                name="address"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
              >
                <Input.TextArea placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" rows={3} />
              </Form.Item>

              <Form.Item
                label="Ghi chú"
                name="note"
              >
                <Input.TextArea placeholder="Ghi chú về đơn hàng (nếu có)" rows={2} />
              </Form.Item>

              <Divider />

              <Title level={4} style={{ marginBottom: 16 }}>Phương thức thanh toán</Title>

              <Form.Item name="paymentMethod" initialValue="cash">
                <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)}>
                  <Space direction="vertical">
                    <Radio value="cash">
                      <Space>
                        <DollarOutlined />
                        <Text>Thanh toán tiền mặt khi nhận hàng (COD)</Text>
                      </Space>
                    </Radio>
                    <Radio value="bank">
                      <Space>
                        <CreditCardOutlined />
                        <Text>Chuyển khoản ngân hàng</Text>
                      </Space>
                    </Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>

              {paymentMethod === 'bank' && (
                <div style={{ margin: '16px 0', padding: '16px', border: '1px dashed #d9d9d9', borderRadius: 4 }}>
                  <Text strong>Thông tin chuyển khoản:</Text>
                  <div style={{ marginTop: 8 }}>
                    <p>Số tài khoản: <Text strong>03864665210386466521</Text></p>
                    <p>Ngân hàng: <Text strong>MBBank </Text></p>
                    <p>Chủ tài khoản: <Text strong>DuyLongShopLongShop</Text></p>
                    <p>Nội dung chuyển khoản: <Text strong>SDH12345 (mã đơn hàng của bạn)</Text></p>
                  </div>
                </div>
              )}

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="large" 
                  block 
                  loading={loading}
                >
                  Hoàn tất đơn hàng
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={10}>
          <Card title="Đơn hàng của bạn" bordered>
            <div style={{ marginBottom: 16 }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', marginBottom: 12 }}>
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    style={{ width: 60, height: 60, objectFit: 'cover', marginRight: 12 }}
                  />
                  <div style={{ flex: 1 }}>
                    <Text strong>{item.name}</Text>
                    <div>
                      <Text>{item.quantity} x {item.price.toLocaleString()} VND</Text>
                    </div>
                  </div>
                  <Text strong>{(item.price * item.quantity).toLocaleString()} VND</Text>
                </div>
              ))}
            </div>

            <Divider />

            <Row justify="space-between" style={{ marginBottom: 8 }}>
              <Text>Tạm tính:</Text>
              <Text>{subtotal.toLocaleString()} VND</Text>
            </Row>
            <Row justify="space-between" style={{ marginBottom: 8 }}>
              <Text>Phí vận chuyển:</Text>
              <Text>0 VND</Text>
            </Row>
            <Row justify="space-between">
              <Text strong>Tổng cộng:</Text>
              <Text type="danger" strong>{subtotal.toLocaleString()} VND</Text>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;