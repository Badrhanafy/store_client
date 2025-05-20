
import {createBrowserRouter} from "react-router-dom"
import Home from "../pages/home"
import Login from "../pages/login"
import Signup from "../pages/Signup"
import Notfound from "../pages/Notfound"
import Layout from "../layouts/layout"
import AddProduct from "../pages/AddProduct"
import ProductsListe from "../pages/products"
import HomePage from "../pages/home"
import ProductDetailsPage from "../pages/SinglePage"
import Cart from "../pages/Carte"
import AllProducts from "../pages/admin/AllProducts"
import ContactPage from "../pages/Contacts"
import Kobiyat from "../pages/Kobiyat"
import Casketat from "../pages/casketat"
import AdminLogin from "../pages/admin/AdminLogin"
import AdminDashboard from "../pages/admin/Dashboard"
import ProductList from "../pages/products"
import Products from "../pages/admin/Products"
import OrdersComponent from "../pages/admin/Orders"
import SettingsComponent from "../pages/admin/Settings"
import ForgotResetPassword from "../pages/PwdReset"
export const router = createBrowserRouter([
  {
    element : <Layout/>,
    children:[
      {
        path : 'AllProducts/product/:id',
        element : <ProductDetailsPage/>
      },
      {
        path : 'Cart',
        element : <Cart/>
      },
      {
        path : '/',
        element : <HomePage/>
      },
      {
        path : '/login',
        element : <Login/>
      },
      {
        path : '/signup',
        element : <Signup/>
      }, 
      {
        path : 'form',
        element : <AddProduct/>
      },
      {
        path : '/AllProducts',
        element : <ProductsListe/>
      }, 
      {
        path : '*',
        element : <Notfound/>
      },
     /*  {
        path : '/admin/AllProducts',
        element : <AllProducts/>
      }, */
       {
        path : '/Fortis/Contacts',
        element : <ContactPage/>
      },
      {
        path : '/products/9obiyat',
        element: <Kobiyat/>
      },
        {
        path : '/products/casketat',
        element: <Casketat/>
      },
       {
        path : '/PasswoRdreset',
        element: <ForgotResetPassword/>
      },
      
     
    ]
  }
 ,
     {
        path:"/admin/dashboard",
        element: <AdminDashboard/>
      },
     {
      path:"/admin/AllProductsFortest",
      element:<Products/>
     },
      {
      path:"/admin/Orders",
      element:<OrdersComponent/>
     },
    /*  {
      path:"/admin/settings",
      element:<SettingsComponent/>
     } */
  /// no kida3 h hhh
])