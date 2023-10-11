import express from 'express';
import { register , login , logout , update , followUnfollow  , getUser , getUserById, getAllUsers} from '../controllers/userController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

// get user route
router.get("/profile/:username" , protectRoute , getUser)
router.get("/:id" , protectRoute , getUserById)
router.get("/test/allUsers" , protectRoute , getAllUsers)
// register route
router.post('/register', register);
// login route
router.post("/login", login)
// logout route
router.post("/logout" , logout)
// follow route
router.post("/follow/:id" , protectRoute , followUnfollow)
// update route
router.put("/update/:id" , protectRoute , update)




// update route

export default router;