import { Button, Form, Input, Card, Typography, message } from "antd";
import { useAuth } from "../../hooks";
import { useNavigate, useLocation } from "react-router-dom";
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import React from "react";

const { Title } = Typography;

function Register() {
  const { mutate, isLoading } = useAuth({ resource: "register" });
  const navigate = useNavigate();
  const location = useLocation();
  
  const onFinish = async (values: any) => {
    try {
      const { confirmPassword, ...registerData } = values;
      const response = await mutate(registerData);
      
      // Gọi callback từ location.state nếu có (tương tự login)
      if (location.state?.onRegisterSuccess) {
        location.state.onRegisterSuccess(response.data.user);
      }
      
      message.success('Đăng ký thành công! Bạn có thể đăng nhập ngay');
      navigate('/login', { state: { from: location.state?.from } }); // Chuyển đến trang login
    } catch (error) {
      message.error('Đăng ký thất bại! Vui lòng kiểm tra lại thông tin');
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
          <Title level={3}>Đăng ký tài khoản</Title>
        </div>
        
        <Form
          name="register-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
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
              prefix={<MailOutlined />} 
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

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Nhập lại mật khẩu" 
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              loading={isLoading}
            >
              Đăng ký
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Button type="link" onClick={() => navigate('/login')}>
              Đã có tài khoản? Đăng nhập ngay
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default Register;