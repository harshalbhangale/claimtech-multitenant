import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <Box >
      <Outlet />
    </Box>
  );
};

export default AuthLayout; 