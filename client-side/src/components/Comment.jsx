import { Avatar, Button, Divider, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { BsThreeDots } from 'react-icons/bs'
import { useToast } from '@chakra-ui/react'



function Comment({ comment , currentUser , post , setReplies}) {
    const toast = useToast()
    const menuList = [
        {name: "Copy"},
        {name: "Edit"},
        {name: "Delete"}
    ]
    
    const handleCopy = ()=>{
        navigator.clipboard.writeText(comment.text)
        toast({
            title: "Copied",
            description: "Comment copied to clipboard",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
    }

    const handleDelete = async ()=>{
        try{
            const res = await fetch(`/api/posts/${post._id}/comment/${comment._id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${currentUser.token}`,
                },
              });
              const data = await res.json();
              if (data.error) {
                toast({
                    title: "An error occurred.",
                    description: data.error,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                return;
              }
              console.log(data)
              // delete all old replies and set post.replies 
              setReplies(data.replies)
        }catch(error){
            console.log(error)
        }
    }
  return (
   <>
    <Flex gap={4} py={2} my={2} w={"full"} >
        {comment.userProfilePic && <Avatar size="sm" name="Usama" src={comment.userProfilePic} />}
        <Flex w={"full"} flexDirection={"column"} gap={1}>
            <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"}>
                <Text fontSize={"sm"} fontWeight={"bold"}>{comment.username}</Text>
                <Flex gap={4} alignItems={"center"}>
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
                                    transition={"all .2s ease-in-out"} onClick={()=>{
                                        if(item.name === "Copy"){
                                            handleCopy()
                                        }
                                        if(item.name === "Delete"){
                                            handleDelete()
                                        }
                                    }}>{item.name}</MenuItem>
                                )
                            })}
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>
            <Text fontSize={"sm"}>{comment.text}</Text>
        </Flex>
    </Flex>
    <Divider bg="black" my={3} />
   </>
  )
}

export default Comment