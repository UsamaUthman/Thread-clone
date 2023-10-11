import { Button, Flex, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import { useToast } from '@chakra-ui/react'

function LogoutButton() {
    const setUser = useSetRecoilState(userAtom)
    const toast = useToast()

    const logout = async () => {
        try{
            localStorage.removeItem('user-threads')
            const res = await fetch('/api/users/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const data = await res.json()
            if(data.error){
                toast({
                    title: "An error occurred.",
                    description: data.error,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  })
                  return;
            }
            setUser(null)
        }catch(err){
            console.log(err)
        }
    }
  return (
    <Flex  position={"fixed"} top={6} right={6}>
        <Button onClick={logout} color={useColorModeValue("white")} bg={useColorModeValue("gray.dark")}>
           Logout
        </Button>
    </Flex>
  )
}

export default LogoutButton