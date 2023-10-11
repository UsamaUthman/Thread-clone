import { 
    Avatar,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Image,
    Link,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    Text,
    useColorMode, 
   useDisclosure, 
   ModalHeader} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { useToast } from "@chakra-ui/react"
import userAtom from "../atoms/userAtom"
import { AiFillHome } from "react-icons/ai"

function Header() {
    const [users , setUsers] = useState([])
    const [defaultUsers , setDefaultUsers] = useState([])
    const [search , setSearch] = useState("")
    const [isUpdate , setIsUpdate] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { colorMode , toggleColorMode } = useColorMode()
    const currentUser = useRecoilValue(userAtom)
    const setCurrentUser = useSetRecoilState(userAtom)
    const toast = useToast()


    const handleHomePage = () => {
      if(!currentUser) {
        toast({
          title: "An error occurred.",
          description: "You need to login first",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      window.location.href = "/"
    }

    useEffect(() => {
      const getUsers = async ()=>{
        try {
          const res = await fetch("/api/users/test/allUsers" , {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })
          const data = await res.json()
          if(data.error) {
            toast({
              title: "An error occurred.",
              description: data.error,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            return
          }
          setUsers(data.users)
          setDefaultUsers(data.users)
        } catch (error) {
          console.log(error)
        }
      }
  
      getUsers()
      
    }, [])

    const handleSerach = async (e)=>{
     const value = e.target.value
      setSearch(value)
      if(value.length === 0) {
        setUsers(defaultUsers)
        return
      }
      const filteredUsers = defaultUsers.filter((user)=>{
        return user.username.toLowerCase().includes(value.toLowerCase())
      })
      setUsers(filteredUsers)      
    }

    const handleFollow = async (user) => {
      // Check if the current user is trying to follow themselves
      if (currentUser._id === user) {
        return handleFollowError("You can't follow yourself");
      }
    
      // Check if the user is logged in
      if (!currentUser) {
        return handleFollowError("You must be logged in to follow");
      }
    
      // Initiate the follow operation
      setIsUpdate(true);
      try {
        const data = await followUser(user);
    
        if (data.error) {
          return handleFollowError(data.error);
        }
    
        // Update the current user and save data to local storage
        setCurrentUser(data.user);
        localStorage.setItem("user-threads", JSON.stringify(data.user));
    
        // Show a success toast
        toast({
          title: "Success",
          description: data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        handleFollowError(err);
      } finally {
        setIsUpdate(false);
      }
    };
    
    const followUser = async (user) => {
      const res = await fetch(`/api/users/follow/${user}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.json();
    };
    
    const handleFollowError = (errorMessage) => {
      // Show an error toast
      toast({
        title: "An error occurred.",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    };
  return (
    <Flex justifyContent={"space-between"} flexDirection={{base : "column" , md :"row"}} alignItems={"center"} gap={5}  mt={6} mb={12}>
        <Link onClick={handleHomePage} display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <AiFillHome size={25} cursor={"pointer"} />
        </Link>
        <Flex >
          <Image 
          cursor={"pointer"}
          width={"50%"}
          alt="logo"
          w={7}
          src={colorMode === "light" ? "/dark-logo.svg" : "/light-logo.svg"}
          onClick={toggleColorMode}
          />
        </Flex>
        {currentUser && (
          <Button onClick={onOpen} mr={2}>Users</Button>
        )}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Search For User</ModalHeader>
          <ModalCloseButton  />
          <ModalBody pb={6}>
              <FormControl>
                <Input placeholder='Search for users' my={5} onChange={(e)=>{
                  handleSerach(e)
                }} />
              </FormControl>
                <Flex flexDirection={"column"} maxH={400} overflowY={"scroll"}>
                {users.map((user , index)=>{
                return (
                    <Flex key={index}  justifyContent={"space-between"} alignItems={"center"} p={2} cursor={"pointer"} onClick={()=>{
                      window.location.href = `/profile/${user.username}`
                      onClose()
                    }}>
                      <Flex justifyContent={"center"} alignItems={"center"} gap={5}>
                        <Avatar size="lg" name="Usama" src={user.profilePic} />
                        <Text fontSize={"sm"}>{user.username}</Text>
                        {currentUser?._id === user._id && (
                          <Text fontSize={"sm"}>You Account</Text>
                        )}
                      </Flex>
                      <Flex onClick={(e)=>{
                        e.preventDefault()
                        e.stopPropagation()
                      }}>
                        <Button bg={"gray.dark"} color={"white"} _hover={{bg: "gray.700"}} size={10} fontSize={"sm"} p={2} onClick={()=>{
                          handleFollow(user._id)
                        }} isDisabled={currentUser?._id === user._id} isLoading={isUpdate}>
                          {currentUser?.following?.includes(user._id) ? "Following" : "Follow"}
                        </Button>
                      </Flex>
                    </Flex>
                )
              } )}
                </Flex>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default Header