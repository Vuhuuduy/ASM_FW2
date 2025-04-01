import { Result, Button, Typography } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title } = Typography;

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
      <Result
        icon={<SmileOutlined />}
        title={
          <Title level={3}>
            Đặt hàng thành công!
          </Title>
        }
        subTitle={`Mã đơn hàng của bạn: ${orderId || 'N/A'}`}
        extra={[
          <Button 
            type="primary" 
            key="home" 
            onClick={() => navigate('/products')}
            style={{ marginRight: 8 }}
          >
            Về trang chủ
          </Button>,
          <Button 
            key="order" 
            onClick={() => navigate('/cart')}
          >
            Xem đơn hàng
          </Button>,
        ]}
      />
    </div>
  );
};

export default OrderSuccessPage;