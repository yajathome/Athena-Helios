import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from './App';
import HomePage from './pages/Home';
import ApartmentLeaderBoardPage from './pages/ApartmentLeaderboard';
import ApartmentLoginPage from './pages/ApartmentLogin';
import ApartmentRegisterPage from './pages/ApartmentRegister';
import ResidentLoginPage from './pages/ResidentLogin';
import ResidentRegisterPage from './pages/ResidentRegister';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {index: true, element: <HomePage />},
      {path: "/apartment-leaderboard", element: <ApartmentLeaderBoardPage />},
      {path: "/apartment-login", element: <ApartmentLoginPage />},
      {path: "/apartment-register", element: <ApartmentRegisterPage />},
      {path: "/resident-login", element: <ResidentLoginPage />},
      {path: "/resident-register", element: <ResidentRegisterPage />},
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

