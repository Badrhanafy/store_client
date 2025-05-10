
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
      {
        path : '/admin/AllProducts',
        element : <AllProducts/>
      },
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
      }
    ]
  }
 
  /// no kida3 h hhh
])