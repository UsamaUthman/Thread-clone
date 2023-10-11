import
    {
        Avatar,
        Box,
        Button,
        Flex,
        Image,
        Menu,
        MenuButton,
        MenuItem,
        MenuList,
        Text 
    } from '@chakra-ui/react'
import React, { useEffect , useState } from 'react'
import { Link } from 'react-router-dom'
import { BsThreeDots } from 'react-icons/bs'
import Actions from './Actions'


function Post({currentUser  , post }) {
    const [liked , setLiked] = useState(post?.likes?.includes(currentUser?._id))
    const [username , setUsername] = useState("")
    const [userImg , setUserImg] = useState("")
    const [likes , setLikes] = useState(post?.likes?.length)
    const [replies , setReplies] = useState(post?.replies)
    const menuList = [
        {name: "Copy"},
        {name: "Edit"},
        {name: "Delete"}
    ]
    useEffect(() => {
        const getPostUser = async ()=>{
            try {
                const res = await fetch(`/api/users/${post.postedBy}`, {
                    method: "GET",
                });
                const data = await res.json();
                if (data.error) {
                    console.log(data.error)
                    return;
                }
                setUsername(data.user.username)
                setUserImg(data.user.profilePic)
            } catch (error) {
                console.log(error)
            }
        }

        getPostUser()
    }, [])

    return (
        <Link to={`/${username}/post/${post._id}`}>
            <Flex gap={3} mb={4} py={5}>
            <Flex flexDirection={"column"} alignItems={"center"}>
                <Avatar size="md" name={username} src={userImg} />
                <Box
                w={"1px"}
                h="full"
                bg="gray.light"
                my={2}>
                </Box>
                <Box position={"relative"} w={"full"} mt={4}>
                    <Avatar size="xs" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" 
                    position={"absolute"}
                    top={"0px"}
                    left={"15px"}
                    padding={"2px"}
                    />
                </Box>
            </Flex> 
            <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text fontSize={"sm"} fontWeight={"bold"}> {username} </Text>
                            <Image src="/verified.png" alt="verified" w={"15px"} h={"15px"} ml={1}/>
                        </Flex>
                        <Flex alignItems={"center"} gap={2}>
                            <Text fontSize={"sm"}>{(new Date().toLocaleDateString())}</Text>
                            <div onClick={(e)=>{
                                e.preventDefault()
                            }}>
                            <Menu >
                                <MenuButton >
                                    <BsThreeDots as={Button} size={20} cursor={"pointer"}/>
                                </MenuButton>
                                <MenuList bg={"gray.dark"}>
                                    {menuList.map((item , index)=>{
                                        if(item.name === "Delete" && currentUser?._id !== post.postedBy) return null
                                        if(item.name === "Edit" && currentUser?._id !== post.postedBy) return null
                                        return (
                                            <MenuItem key={index} bg={"gray.dark"}
                                            _hover={{bg: "gray.light"}}
                                            transition={"all .2s ease-in-out"}>{item.name}</MenuItem>
                                        )
                                    })}
                                </MenuList>
                            </Menu>
                            </div>
                        </Flex>
                    </Flex>
                    <Text fontSize={"sm"}>{post.text}</Text>
                    {post.img &&
                        <Box
                        borderRadius={6}
                        overflow={"hidden"}
                        border={"1px solid"}
                        borderColor={"gray.light"}
                        height={300}
                        >
                            <Image src={post.img} alt="post" objectFit={"contain"} height={"300"} width={"full"} />
                        </Box>
                    }
                    <Actions liked={liked} setLiked={setLiked} post={post} currentUser={currentUser} setReplies={setReplies}  setLikes={setLikes} />
                    <Flex gap={2} alignItems={"center"}>
                        <Text color={"gray.light"} fontSize={"sm"}> {replies?.length} replies</Text>
                        <Text color={"gray.light"} fontSize={"sm"}>{likes} likes</Text>
                    </Flex>
            </Flex>
            </Flex>
        </Link>
    )
}

export default Post 