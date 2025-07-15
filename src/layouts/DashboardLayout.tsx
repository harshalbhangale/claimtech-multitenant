import { Outlet } from 'react-router-dom';
import {
  Box,
} from '@chakra-ui/react';

const DashboardLayout = () => {
  return (
    <Box minH="100vh">
      <Outlet />
    </Box>
  );
};

export default DashboardLayout; 