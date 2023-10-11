import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  useToast,
} from '@chakra-ui/react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import { useRef, useState } from 'react'
import profileImageChange from '../../hooks/profileImageChange'

export default function UserProfileEdit() {
  const fileRef = useRef(null)
  const user = useRecoilValue(userAtom)
  const setUser = useSetRecoilState(userAtom)
  const [isUpdate , setIsUpdate] = useState(false)
  const toast = useToast()
  const {handleImageChange , imgUrl} = profileImageChange()
  const [data , setData] = useState({
    name: user?.name,
    username: user?.username,
    email: user?.email,
    bio: user?.bio,
    password: ''
  })

  // Update user
  const handleUpdate = async () => {
    setIsUpdate(true);
  
    try {
      if (isUpdateDataEmpty(data) && !imgUrl) {
        showErrorToast("Please fill one of the fields to update.");
        return;
      }
  
      if (isDataUnchanged(data, user) && !imgUrl) {
        showErrorToast("Please fill one of the fields to update.");
        return;
      }
  
      const response = await updateUser(data, imgUrl);
  
      if (response.error) {
        showErrorToast(response.error);
        return;
      }
  
      updateLocalStorageAndState(response.user);
      showSuccessToast("Your user has been updated.");
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdate(false);
    }
  };
  
  // Check if data is empty
  const isUpdateDataEmpty = (data) => {
    return !data.name && !data.username && !data.email && !data.bio && !data.password;
  };

  // Check if data is unchanged
  const isDataUnchanged = (data, user) => {
    return (
      data.name === user.name &&
      data.username === user.username &&
      data.email === user.email &&
      data.bio === user.bio &&
      data.password === ''
    );
  };
  
  // Pop up toasts Error
  const showErrorToast = (message) => {
    toast({
      title: "An error occurred.",
      description: message,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Pop up toasts Success
  const showSuccessToast = (message) => {
    toast({
      title: "User Updated.",
      description: message,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Update user
  const updateUser = async (data, imgUrl) => {
    const response = await fetch(`/api/users/update/${user?._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data, profilePic: imgUrl }),
    });
  
    return await response.json();
  };
  
  // Update local storage and state
  const updateLocalStorageAndState = (user) => {
    localStorage.setItem('user-threads', JSON.stringify(user));
    setUser(user);
  };


  return (
    <Flex
      minH={'80vh'}
      align={'center'}
      justify={'center'}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.dark')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={4}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          User Profile Edit
        </Heading>
        <FormControl>
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              <Avatar size="xl" bg={"gray.dark"} src={imgUrl || user?.profilePic}>
              </Avatar>
            </Center>
            <Center w="full">
              <Button w="full" onClick={()=>{
                fileRef.current.click()
              }}>Change Icon</Button>
              <Input type='file' ref={fileRef} style={{display: 'none'}} onChange={handleImageChange} />
            </Center>
          </Stack>
        </FormControl>
        <FormControl >
          <FormLabel>Name</FormLabel>
          <Input
            placeholder={user?.name}
            _placeholder={{ color: 'gray.500' }}
            type="text"
            onChange={(e) => setData({...data, name: e.target.value})}
          />
        </FormControl>
        <FormControl >
          <FormLabel>UserName</FormLabel>
          <Input
            placeholder={user?.username}
            _placeholder={{ color: 'gray.500' }}
            type="text"
            onChange={(e) => setData({...data, username: e.target.value})}
          />
        </FormControl>
        <FormControl >
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder={user?.email}
            _placeholder={{ color: 'gray.500' }}
            type="email"
            onChange={(e) => setData({...data, email: e.target.value})}
          />
        </FormControl>
        <FormControl >
          <FormLabel>Bio</FormLabel>
          <Input
            placeholder={user?.bio}
            _placeholder={{ color: 'gray.500' }}
            type="email"
            onChange={(e) => setData({...data, bio: e.target.value})}
          />
        </FormControl>
        <FormControl >
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="*****"
            _placeholder={{ color: 'gray.500' }}
            type="password"
            onChange={(e) => setData({...data, password: e.target.value})}
          />
        </FormControl>
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            bg={'red.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.500',
            }}>
            Cancel
          </Button>
          <Button
            bg={'blue.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'blue.500',
            }}
            onClick={handleUpdate}
            isLoading={isUpdate}
            >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}