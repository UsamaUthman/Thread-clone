import { 
    Avatar, 
    Box,
    Button,
    Flex,
    Menu, 
    MenuButton, 
    MenuItem, 
    MenuList, 
    Text, 
    VStack, 
    useColorModeValue, 
    useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BsInstagram } from 'react-icons/bs'
import { CgMoreO } from 'react-icons/cg'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'


function UserHeader({user , posts}) {
    const currentUser = useRecoilValue(userAtom)
    const setCurrentUser = useSetRecoilState(userAtom)
    const [follwing , setFollowing] = useState(user?.followers?.includes(currentUser?._id))
    const [isUpdate , setIsUpdate] = useState(false)
    
    const toast = useToast()
    const copyUrl = () => {
        navigator.clipboard.writeText(window.location.href)
        toast({
            title: "Copied",
            description: "Profile link copied to clipboard",
            duration: 1000,
          })
    }



    const handleFollow = async () => {
        if(!currentUser) return toast({
            title: "An error occurred.",
            description: "You must be logged in to follow",
            status: "error",
            duration: 3000,
            isClosable: true,
            })  
            setIsUpdate(true)
        try{
            const res = await fetch(`/api/users/follow/${user?._id}` , {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
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
            }

            toast({
                title: "Success",
                description: data.message,
                status: "success",
                duration: 3000,
                isClosable: true,
              })
            setCurrentUser(data.user)
            setFollowing(!follwing)
            if(follwing){
                user.followers = user.followers.filter((id) => id !== currentUser._id)
            }else{
                user.followers.push(currentUser._id)
            }
            console.log(data.user)
            localStorage.setItem("user-threads" , JSON.stringify(data.user))
            
        }catch(err){
            toast({
                title: "An error occurred.",
                description: err,
                status: "error",
                duration: 3000,
                isClosable: true,
              })
        } finally{
            setIsUpdate(false)
        }
    }

  

    return (
        <VStack gap={6} alignItems={"start"}>      
            <Flex justifyContent={"space-between"} w={"full"}>
                <Box>
                    <Text fontSize={"2xl"} fontWeight={"bold"}>{user?.username}</Text>
                    {user?.bio && <Text fontSize={"md"} color={"gray.light"}>
                        bio : {user?.bio}
                    </Text>}
                    <Flex alignItems={"center"} gap={2}>
                        <Text fontSize={"sm"}>{posts} post</Text>
                        <Text fontSize={"sm"}> {user?.followers?.length} followers </Text>
                        <Text fontSize={"sm"}> {user?.following?.length} following </Text>
                    </Flex>  
                    {(currentUser?._id !== user?._id && currentUser) && 
                        <Button bg={"gray.dark"} color={useColorModeValue("white")} my={4} onClick={handleFollow} >
                            {follwing ? "Unfollow" : "Follow"}
                        </Button>}
                </Box>
                <Box>
                    <Avatar 
                    name= {user?.username}
                    src= {user?.profilePic}
                    size={{
                        base: "lg",
                        md: "xl",
                    }}
                    />
                </Box>
            </Flex>
            <Flex justifyContent={{
                base: "center",
                md: "space-between",
            }} w={"full"} flexDirection={{
                base: "column",
                md: "row",
            }}
            alignItems={{
                base: "center",
                md: "flex-start",
            
            }}
            gap={{
                base: 5,
                md: 0,
            }}>
                <Flex alignItems={"center"} gap={2} color={"gray.light"}>
                    <Text fontSize={"sm"}>{posts} post</Text>   
                    <Box w={"5px"} h={"5px"} bg={"gray.light"} borderRadius={"full"}></Box>
                    <Link >instagram.com</Link>
                </Flex>
                <Flex alignItems={"center"} gap={3}>
                   {currentUser?._id === user?._id && <Link to={`/update/${currentUser?._id}`}><Text fontSize={"sm"} fontWeight={"bold"}>Edit Profile</Text></Link>}
                    <Box>
                        <BsInstagram size={22} cursor={"pointer"}/>
                    </Box>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                        <Menu>
                            <MenuButton >
                                <CgMoreO size={22} cursor={"pointer"}/>
                            </MenuButton>
                            <MenuList bg={"gray.dark"}>
                                <MenuItem bg={"gray.dark"}
                                _hover={{bg: "gray.light"}}
                                transition={"all .2s ease-in-out"}
                                onClick={copyUrl}
                                >copy profile link</MenuItem>
                            </MenuList>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>
            <Flex w={"full"}>
               <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb={3} cursor={"pointer"}>
                <Text fontSize={"l"} fontWeight={"bold"}>Posts</Text>
               </Flex>
            </Flex>
        </VStack>
    )
}

export default UserHeader