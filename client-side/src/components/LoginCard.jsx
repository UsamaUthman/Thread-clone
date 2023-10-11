import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import { useToast } from '@chakra-ui/react'

export default function LoginCard({ setShowLogin}) {
    const setUser = useSetRecoilState(userAtom)
    const toast = useToast()
    const [data, setData] = useState({
        username: '',
        password: ''
      })

      const handleLogin = async () => {
        try{

        const res = await fetch('/api/users/login', {
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
            localStorage.setItem('user-threads', JSON.stringify(resData))
            setUser(resData)
            setShowLogin(false)
        }

        }catch(err){
            console.log(err)
        }
      }
  return (
    <Flex
      minH={'80vh'}
      align={'center'}
      justify={'center'}>
      <Stack spacing={5} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'2xl'}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          boxShadow={'lg'}
          width={'md'}
          p={8}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input type="text" onChange={(e)=>{
                    setData({...data, username: e.target.value})
              }} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" onChange={(e)=>{
                    setData({...data, password: e.target.value})
              }}/>
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Text>Don't have a account</Text>
                <Text color={'blue.400'} cursor={"pointer"}>
                    <Link onClick={()=>{
                        setShowLogin(false)
                    }}>
                    Creat Account
                    </Link>
                    </Text>
              </Stack>
              <Button
                bg={useColorModeValue('gray.600', 'gray.700')}
                color={'white'}
                _hover={{
                  bg: useColorModeValue('gray.700', 'gray.800')
                }}
                onClick={handleLogin}
                loadingText={"Signing in"}
                >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}