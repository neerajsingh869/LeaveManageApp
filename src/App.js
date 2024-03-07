import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import './App.css';
import { app } from "./configs/firebase";
import CustomUserContextProvider from './contexts/userContext';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Navbar from './components/nav/Navbar';
import Page404 from './pages/error/Page404';
import Home from './pages/home/Home';
import PrivateRoute from './components/secure/PrivateRoute';
import ApplyLeave from './pages/applyLeave/ApplyLeave';

function App() {

  const routes = createRoutesFromElements(
    <Route path="/" element={ <Navbar /> } errorElement={ <Page404 /> }>
      <Route index={ true } element={ <Home /> } />
      <Route path="signin" element={ <Login /> } />
      <Route path="signup" element={ <Register /> } />
      <Route path="applyleaves" element={ 
        <PrivateRoute>
          <ApplyLeave />
        </PrivateRoute>
       } />
    </Route>
  );

  const router = createBrowserRouter(routes);

  return (
    <CustomUserContextProvider>
      <RouterProvider router={ router } />
    </CustomUserContextProvider>
  );
}

export default App;
