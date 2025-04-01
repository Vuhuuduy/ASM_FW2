import React, { useState, useEffect } from 'react';
import { 
  Layout, Card, Row, Col, Input, Button, Tag, Typography, Image, 
  Space, Menu, Dropdown, Badge, message, Modal, Form, Empty 
} from 'antd';
import { 
  SearchOutlined, ShoppingCartOutlined, 
  UserOutlined, DownOutlined, PlusOutlined, EditOutlined, ShopOutlined 
} from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { Meta } = Card;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [editForm] = Form.useForm();
  const navigate = useNavigate();

  // Lấy dữ liệu sản phẩm và user
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, usersRes] = await Promise.all([
          axios.get('http://localhost:3000/products'),
          axios.get('http://localhost:3000/users')
        ]);

        setProducts(productsRes.data);
        
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          const fullUser = usersRes.data.find(u => u.id === userData.id);
          if (fullUser) {
            setUser(fullUser);
            await updateCartCount(fullUser.id);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cập nhật số lượng giỏ hàng
  const updateCartCount = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:3000/carts?userId=${userId}`);
      const count = res.data.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  };

  // Xử lý đăng nhập
  const handleLoginSuccess = async (userData) => {
    try {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      await updateCartCount(userData.id);
      message.success('Đăng nhập thành công!');
    } catch (error) {
      console.error('Login error:', error);
      message.error('Đăng nhập thất bại');
    }
  };

  // Thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async (product) => {
    if (!user) {
      message.warning('Vui lòng đăng nhập để thêm sản phẩm');
      navigate('/login', { state: { onLoginSuccess: handleLoginSuccess } });
      return;
    }

    try {
      // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
      const { data } = await axios.get(
        `http://localhost:3000/carts?userId=${user.id}&productId=${product.id}`
      );

      if (data.length > 0) {
        // Cập nhật số lượng nếu đã có
        await axios.patch(`http://localhost:3000/carts/${data[0].id}`, {
          quantity: data[0].quantity + 1
        });
      } else {
        // Thêm mới nếu chưa có
        await axios.post('http://localhost:3000/carts', {
          userId: user.id,
          productId: product.id,
          quantity: 1
        });
      }

      message.success('Đã thêm vào giỏ hàng!');
      await updateCartCount(user.id);
    } catch (error) {
      console.error('Error adding to cart:', error);
      message.error('Thêm vào giỏ hàng thất bại');
    }
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCartCount(0);
    message.success('Đăng xuất thành công!');
  };

  // Xử lý chuyển trang giỏ hàng
  const handleCartClick = () => {
    if (!user) {
      message.warning('Vui lòng đăng nhập để xem giỏ hàng');
      navigate('/login', { state: { onLoginSuccess: handleLoginSuccess } });
      return;
    }
    navigate('/cart');
  };

  // Cập nhật thông tin user
  const handleUpdateProfile = async (values) => {
    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, values);
      const updatedUser = { ...user, ...values };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsModalVisible(false);
      message.success('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Update error:', error);
      message.error('Cập nhật thông tin thất bại');
    }
  };

  // Menu dropdown tài khoản
  const accountMenu = (
    <Menu
      items={[
        { 
          key: '1', 
          label: 'Tài khoản của tôi',
          icon: <UserOutlined />,
          onClick: () => setIsModalVisible(true)
        },
        { 
          key: '2', 
          label: 'Đơn hàng',
          icon: <ShopOutlined />,
          onClick: () => navigate('/orders')
        },
        { 
          key: '3', 
          label: 'Đăng xuất',
          icon: <EditOutlined />,
          onClick: handleLogout
        },
      ]}
    />
  );

  // Lọc sản phẩm theo search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Header style={{ 
        background: '#fff', 
        boxShadow: '0 2px 8px #f0f1f2',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={3} style={{ color: '#ee4d2d', margin: 0 }}>DuyLongShop</Title>
          </Col>
          <Col flex="auto" style={{ padding: '0 20px' }}>
            <Input
              size="large"
              placeholder="Tìm kiếm sản phẩm..."
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col>
            <Space size="middle">
              {user ? (
                <Dropdown overlay={accountMenu} trigger={['hover']}>
                  <Button type="text">
                    <UserOutlined /> {user.username} <DownOutlined />
                  </Button>
                </Dropdown>
              ) : (
                <Button 
                  type="text" 
                  onClick={() => navigate('/login', { state: { onLoginSuccess: handleLoginSuccess } })}
                >
                  <UserOutlined /> Đăng nhập
                </Button>
              )}
              
              <Badge count={cartCount}>
                <Button 
                  type="text" 
                  icon={<ShoppingCartOutlined />} 
                  onClick={handleCartClick}
                >
                  Giỏ hàng
                </Button>
              </Badge>
            </Space>
          </Col>
        </Row>
      </Header>

      {/* Main Content */}
      <Content style={{ padding: '20px 50px', background: '#f5f5f5' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
          <Title level={4} style={{ marginBottom: 24 }}>TẤT CẢ SẢN PHẨM</Title>
          
          {loading ? (
            <div>Đang tải sản phẩm...</div>
          ) : filteredProducts.length === 0 ? (
            <Empty description="Không tìm thấy sản phẩm phù hợp" />
          ) : (
            <Row gutter={[16, 24]}>
              {filteredProducts.map(product => (
                <Col key={product.id} xs={24} sm={12} md={8} lg={6} xl={4}>
                  <Card
                    hoverable
                    cover={
                      <Image 
                        src={product.imageUrl} 
                        alt={product.name}
                        preview={false}
                        style={{ height: 200, objectFit: 'cover' }}
                      />
                    }
                    actions={[
                      // eslint-disable-next-line react/jsx-key
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.available}
                        block
                      >
                        Thêm vào giỏ
                      </Button>
                    ]}
                  >
                    <Meta
                      title={<Text strong ellipsis>{product.name}</Text>}
                      description={
                        <>
                          <Text type="danger" strong>{product.price.toLocaleString()}₫</Text>
                          <br />
                          <Text type="secondary">{product.category}</Text>
                          <br />
                          <Tag color={product.available ? 'green' : 'red'}>
                            {product.available ? 'Còn hàng' : 'Hết hàng'}
                          </Tag>
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: 'center', background: '#f5f5f5' }}>
        <Text type="secondary">© {new Date().getFullYear()} DuyLongShop. All rights reserved</Text>
      </Footer>

      {/* Modal chỉnh sửa thông tin */}
      <Modal
        title="Chỉnh sửa thông tin"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={editForm}
          initialValues={user || {}}
          onFinish={handleUpdateProfile}
          layout="vertical"
        >
          <Form.Item 
            name="username" 
            label="Tên người dùng" 
            rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="email" 
            label="Email" 
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="phone" 
            label="Số điện thoại"
            rules={[
              { pattern: /^\d+$/, message: 'Chỉ được nhập số' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default ProductList;