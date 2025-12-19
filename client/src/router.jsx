import { createBrowserRouter, Navigate } from 'react-router-dom';
// import SignIn from './auth/SignIn';
import SignIn from "./auth/sign-in";
import DefaultLayout from './layout/DefaultLayout';
import Dashboard from './components/Dashboard/Dashboard';
import Test from './components/Test';
import Error from './components/Misc/Error';
import ProtectedGuard from './guards/ProtectedGraud';
import { Users } from './components/Users/Users';
import { Tickets } from './components/Tickets/Tickets';
import Spinner from './common/spinner/Spinner';
import { Roles } from './components/Roles/Roles';
import TicketView from './components/Tickets/TicketView';
import Profile from './components/profile/Profile';
import Kanban from './common/kanban/Kanban';

const routerArr = [
  // Auth routes should be separate and not under the ProtectedGuard
  {
    path: '/auth',
    children: [
      {
        path: 'signin',
        element: <SignIn />,
      },
      // Optional: You can add more auth-related routes here
      {
        path: '*', // Handle any unknown auth routes
        element: <Navigate to="/auth/signin" replace />,
      },
    ],
  },
  // Protected routes that require authentication
  {
    path: '/',
    element: <ProtectedGuard />, // Protect all routes under "/"
    children: [
      {
        path: '/',
        element: <DefaultLayout />,
        children: [
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'users',
            element: <Users />,
          },
          {
            path: '/', // Dashboard route
            element: <Dashboard />,
          },
          {
            path: 'dashboard', // Dashboard route
            element: <Dashboard />,
          },
          {
            path: 'tickets', // Devices route
            element: <Tickets />,
          },
          {
            path: 'tickets/:ticketId',
            element: <TicketView />,
          },
          {
            path: 'kanban',
            element: <Kanban />,
          },
          {
            path: 'roles', // Metrics route
            // element: <Test />
            element: <Roles />,
          },
          {
            path: 'error', // Error route
            element: <Error />,
          },
          {
            path: '*', // Catch-all for unknown routes
            element: <Error />,
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routerArr);
