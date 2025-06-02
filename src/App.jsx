import logo from './logo.svg';
import './App.css';
import {RouterProvider} from "react-router-dom"
import { router } from './router/index.jsx';
import { WishlistProvider } from './context/Wishlistecontext.jsx';
function App() {
  return (
    <div className="">
       <WishlistProvider>
                <RouterProvider router={router}>
         
       </RouterProvider>
       </WishlistProvider>
         
    </div>
  );
}

export default App;



