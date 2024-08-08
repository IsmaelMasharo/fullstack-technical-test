import { useNavigate } from 'react-router-dom';
import { Button } from '@mantine/core';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from storage
    navigate('/login'); // Redirect to login page
  };

  return (
    <Button onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default Logout;