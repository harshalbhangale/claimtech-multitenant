import { Box } from '@chakra-ui/react';
import { Header } from '../components/Dashboard/Main/Header';
import Profile from '../components/Dashboard/Profile';

const ProfilePage = () => {
  return (
    <Box minH="100vh" bg="white">
      <Header />
      <Profile />
    </Box>
  );
};

export default ProfilePage;