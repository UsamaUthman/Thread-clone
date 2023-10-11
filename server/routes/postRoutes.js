import express from 'express';
import { createPost , getPost , deletePost , likeUnlikePost , replyPost , getFeedPosts , getOwnPosts, deleteReply} from '../controllers/postController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

router.get("/feed" , protectRoute ,  getFeedPosts)
router.get("/:id" , getPost)
router.get("/profile/:id" , protectRoute , getOwnPosts)
router.post("/create", protectRoute, createPost)
router.delete("/delete/:id", protectRoute, deletePost)
router.post("/like/:id", protectRoute, likeUnlikePost)
router.post("/reply/:id", protectRoute, replyPost)
router.delete("/:id/comment/:replyId", protectRoute, deleteReply)


export default router;