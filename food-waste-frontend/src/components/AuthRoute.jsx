import { Navigate } from 'react-router-dom';

const AuthRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

export default AuthRoute; 