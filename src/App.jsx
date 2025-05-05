import logo from './logo.svg';
import './App.css';
import {RouterProvider} from "react-router-dom"
import { router } from './router/index.jsx';
function App() {
  return (
    <div className="">
       <RouterProvider router={router}>
          
       </RouterProvider>
    </div>
  );
}

export default App;



