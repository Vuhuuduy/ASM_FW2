import { Button, Form, Input, Card, Typography, message } from "antd";
import { useAuth } from "../../hooks";
import { useNavigate, useLocation } from "react-router-dom";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import React from "react";

const { Title } = Typography;

function Login() {
  const { mutate, isLoading } = useAuth({ resource: "login" });
  const navigate = useNavigate();
  const location = useLocation();
  
  const onFinish = async (values: any) => {
    try {
      const response = await mutate(values);
      
      // Gọi callback từ location.state nếu có
      if (location.state?.onLoginSuccess) {
        location.state.onLoginSuccess(response.data.user);
      }
      
      message.success('Đăng nhập thành công!');
      navigate(location.state?.from || '/'); // Chuyển hướng về trang trước đó hoặc trang chủ
    } catch (error) {
      message.error('Đăng nhập thất bại! Vui lòng kiểm tra lại email hoặc mật khẩu');
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "#f0f2f5"
    }}>
      <Card
        style={{ width: 400, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
        hoverable
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3}>Đăng nhập</Title>
        </div>
        
        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item 
            label="Email" 
            name="email" 
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Nhập email của bạn" 
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Nhập mật khẩu" 
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              loading={isLoading}
              icon={<UserOutlined />}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Button type="link" onClick={() => navigate('/register')}>
              Chưa có tài khoản? Đăng ký ngay
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default Login;