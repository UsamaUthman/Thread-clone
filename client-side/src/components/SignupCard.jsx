'use client'

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import {useToast} from '@chakra-ui/react'
import axios from 'axios'
import { useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'

export default function SignupCard({ setShowLogin}) {
  const [showPassword, setShowPassword] = useState(false)
  const setUser = useSetRecoilState(userAtom)
  const toast = useToast()
  const [data, setData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  })


  const handleSignup = async () => {
    try{
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const resData = await res.json()

    if(resData.error){
      toast({
        title: "An error occurred.",
        description: resData.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return;
    }

    if(resData.success){
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      localStorage.setItem('user-threads', JSON.stringify(resData))
      setUser(resData)
      window.location.href = '/'
    }
    }catch(err){
      console.log(err)
    }
  }

  return (
    <Flex
      minH={'80vh'}
      align={'center'}
      justify={'center'}
      >
      <Stack spacing={5} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input type="text" onChange={(e)=>{
                    setData({...data, name: e.target.value})
                  }} />
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input type="text" onChange={(e)=>{
                    setData({...data, username: e.target.value})
                  }}/>
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" onChange={(e)=>{
                    setData({...data, email: e.target.value})
              }} />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} onChange={(e)=>{
                    setData({...data, password: e.target.value})
                }} />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={useColorModeValue('gray.600', 'gray.700')}
                color={'white'}
                _hover={{
                  bg: useColorModeValue('gray.700', 'gray.800')
                }}
                onClick={handleSignup}>
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <Link color={'blue.400'} onClick={()=>{
                    setShowLogin(true)
                }}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}