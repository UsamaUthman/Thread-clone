import { Button, Flex, useColorMode, useColorModeValue , Spinner, Box, Avatar, Input, Text} from '@chakra-ui/react'
import React, { useEffect , useState} from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { useToast } from '@chakra-ui/react'
import Post from '../components/Post'

function HomePage() {
  const [posts , setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const user = useRecoilValue(userAtom)
  const toast = useToast()

  const handleProfile = () => {
    const userId = user._id
    window.location.href = `/update/${userId}`
  }

  const handleMyPosts = () => {
    const userName = user.username
    window.location.href = `/profile/${userName}`
  }

  useEffect(() => {
    const feedPosts = async ()=>{
      try {
        const res = await fetch("/api/posts/feed" , {
          method: "GET"
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
        setPosts(data.feedPosts)
        setIsLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    feedPosts()
    
  }, [])




  return (
    <>
    <Flex justifyContent={"center"} alignItems={"center"} direction={"column"} gap={5} >
        <Button onClick={handleProfile}
         bg={useColorModeValue("blue.500" , "blue.500")} 
         _hover={{bg: useColorModeValue("blue.600" , "blue.700")}}
         color={"white"}
         >
            <Link>Show Profile</Link>
        </Button>
        <Button onClick={handleMyPosts} bg={"gray.dark"} color={"white"} _hover={{bg: "gray.700"}}>
            <Link>
              Show my posts
            </Link>
        </Button>
    </Flex>

      {user?.following?.length !== 0 ? (
      isLoading ? (
        <Flex justifyContent={"center"} alignItems={"center"} mt={5}>
          <Spinner size={"xl"} />
        </Flex>
      ) : (
        posts.length !== 0 ? (
        <Flex direction={"column"} gap={5}>
          {posts.map((post, index) => (
            <Post key={index} post={post} currentUser={user} />
          ))}
        </Flex>
        ) : (
          <h1 style={{
            textAlign: "center",
            marginTop: "50px"
          }}>
            No posts to show
          </h1>
        )
      )
      ) : (
        <h1 style={{
          textAlign: "center",
          marginTop: "50px"
        }}>
          Follow someone to see their posts
        </h1>
      )}
    </>
  )
}

export default HomePage