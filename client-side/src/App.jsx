import { Button, Container } from "@chakra-ui/react"
import { Navigate, Route, Routes , useParams } from "react-router-dom"
import HomePage from "./pages/HomePage"
import UserPage from "./pages/UserPage"
import PostPage from "./pages/PostPage"
import Header from "./components/Header"
import AuthPage from "./pages/AuthPage"
import { useRecoilValue } from "recoil"
import userAtom from "./atoms/userAtom"
import LogoutButton from "./components/LogoutButton"
import UserProfileEdit from "./pages/UserProfileEdit"
import CreatePost from "./components/CreatePost"


function ProfilePageRoute({id}) {
  const { userId } = useParams();

  return userId === id ? <UserProfileEdit /> : <Navigate to={"/"} />;
}


function App() {
  const user = useRecoilValue(userAtom)


  return (
  <Container maxW="640px">
    <Header />
    <Routes>
      <Route path="/" element={user ? <HomePage /> : <Navigate to={"/auth"} />} />
      <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to={"/"} />} />
      <Route path="/profile/:username" element={<UserPage />} />
      <Route path="/:username/post/:id" element={<PostPage />} />
      <Route path="/update/:userId" element={<ProfilePageRoute  id={user?._id}/>} />
      <Route path="*" element={<Navigate to={"/"} />} />
    </Routes>

    {user && <LogoutButton />}
    {user && <CreatePost />}
  </Container>
  )
}

export default App
