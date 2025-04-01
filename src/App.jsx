import { Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import ProductManagement from './pages/ProductManagement';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import ProductList from './pages/ProductList';
import CartPage from './pages/Cart';
import CheckoutPage from './pages/CheckOut';
import OrderSuccessPage from './pages/OrderSuccess';

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
      </Route>
      <Route path='/login' element={< Login/>} />
      <Route path='/register' element={< Register/>} />
      <Route path='/products' element={< ProductList/>} />
      <Route path='/cart' element={< CartPage/>} />
      <Route path='/checkout' element={< CheckoutPage/>} />
      <Route path='/order-success' element={< OrderSuccessPage/>} />
    </Routes>
  );
}

export default App;
