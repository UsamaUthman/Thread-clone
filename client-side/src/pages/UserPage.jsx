import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'
import { useParams } from 'react-router-dom'
import { Flex, Spinner, useToast } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'

function UserPage() {
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [posts, setPosts] = useState([]); // Add posts state
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom)

  const { username } = useParams();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`, {
          method: "GET",
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
        setUser(data.user);
        setIsLoading(false); // Set loading to false when data is fetched
        const resPost = await fetch(`/api/posts/profile/${data.user._id}`, {
          method: "GET",
        });

        const dataPost = await resPost.json();
  
        if (dataPost.error) {
          toast({
            title: "An error occurred.",
            description: data.error,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
        setPosts(dataPost.posts);
      } catch (err) {
        toast({
          title: "An error occurred.",
          description: err.message, // Use err.message to display the error message
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false); // Set loading to false when the request is finished
      }
    };
    getUser();
  }, [username]);

  if(!user && !isLoading) {
    return <h1>User not found</h1>
  //   return toast({
  //   title: "An error occurred.",
  //   description: "User not found",
  //   status: "error",
  //   duration: 3000,
  //   isClosable: true,
  // });
  }


  return (
    <>
      {!isLoading ? ( // Conditionally render UserHeader when data is loaded
        <UserHeader user={user} posts={posts.length} />
      ) : (
        <Flex justifyContent={"center"} alignItems={"center"} h={"100vh"}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {!isLoading && (
        posts?.map((post , index) =>{
          return (
            <div key={index}>
            <UserPost
              userImg={user.profilePic}
              username={user.username}
              currentUser={currentUser}
              post={post}
           />
           </div>
          )
        })
      )}  
    </>
  );
}

export default UserPage