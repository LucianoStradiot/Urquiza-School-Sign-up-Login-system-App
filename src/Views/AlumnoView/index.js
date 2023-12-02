import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useStateContext } from '../../Components/Contexts';

const AlumnoView = () => {
  const { token } = useStateContext();

  if (!token) {
    return <Navigate to={'/login'} />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AlumnoView;