import Postmodel from '../models/postModel.js';
import User from '../models/userModel.js';
import {v2 as cloudinary} from 'cloudinary';

const createPost = async(req, res) => {
    try{
        const {postedBy , text} = req.body;
        let img = req.body.img;
        if(!postedBy || !text) return res.status(400).json({msg : "Please fill all the fields"});

        const user = await User.findById(postedBy);

        if(!user) return res.status(404).json({msg : "User does not exist"});

        if(user._id.toString() !== req.user._id.toString()) return res.status(400).json({msg : "User not authorized"});

        const maxLength = 500;

        if(text.length > maxLength) return res.status(400).json({msg : "Text exceeds 500 characters"});


        
        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Postmodel({postedBy, text, img});

        await newPost.save();

        res.status(201).json({msg : "Post created successfully" , newPost});
        
    }catch(error){
        console.log(error);
    }
}


const getPost = async(req, res) => {
    try{
        const post = await Postmodel.findById(req.params.id)

        if(!post) return res.status(404).json({msg : "Post not found"});

        res.status(200).json({msg : "Post found" , post});
    }catch(error){
        console.log(error);
        res.status(500).json({msg : "get post error"});
    }
}

const getOwnPosts = async(req, res) => {
    try{
        
        const posts = await Postmodel.find({postedBy : req.params.id}).sort({createdAt : -1});

        if(!posts) return res.status(404).json({msg : "Posts not found"});

        res.status(200).json({msg : "Posts found" , posts});

    }catch(error){
        console.log(error);
        res.status(500).json({msg : "get own posts error"});
    }
}


const deletePost = async(req, res) => {

    try{
        const post = await Postmodel.findById(req.params.id);

        if(!post) return res.status(404).json({msg : "Post not found"});

        if(post.postedBy.toString() !== req.user._id.toString()) return res.status(400).json({msg : "User not authorized"});

        if(post.img){
            await cloudinary.uploader.destroy(post.img.split("/")[7].split(".")[0]);
        }

        await Postmodel.findByIdAndDelete(req.params.id);

        res.status(200).json({msg : "Post deleted successfully"});
    }catch(error){
        console.log(error);
        res.status(500).json({msg : "delete post error"});
    }

}


const likeUnlikePost = async(req, res) => {
    try{

        const post = await Postmodel.findById(req.params.id);

        if(!post) return res.status(404).json({msg : "Post not found"});

        // console.log(post.postedBy.toString() , req.user._id.toString());

        if(post.postedBy.toString() === req.user._id.toString()) return res.status(400).json({error : "You cannot like your own post"});

      
        const isLiked = post.likes.includes(req.user._id.toString());

        if(isLiked){
            await Postmodel.findByIdAndUpdate(req.params.id, {$pull : {likes : req.user._id}});
            res.status(200).json({message : "Post unliked successfully" , likes : post.likes.length - 1});
        }else{
            await Postmodel.findByIdAndUpdate(req.params.id, {$push : {likes : req.user._id}});
            res.status(200).json({message : "Post liked successfully" , likes : post.likes.length + 1});
        }

    }catch(error){
        console.log(error);
        res.status(500).json({msg : "like unlike post error"});
    }
}


const replyPost = async(req, res) => {
    try{    
        const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		const userProfilePic = req.user.profilePic;
		const username = req.user.username;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		const post = await Postmodel.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const reply = { userId, text, userProfilePic, username };


		post.replies.push(reply);
		await post.save();

        // find the reply that was just added
        const replyId = post.replies[post.replies.length - 1];

		res.status(200).json(replyId);

    }catch(error){
        console.log(error);
        res.status(500).json({msg : "reply post error"});
    }
}

const deleteReply = async(req, res) => {
    try{
        const postId = req.params.id;
        const replyId = req.params.replyId;
        const userId = req.user._id;


        const post = await Postmodel.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const reply = post.replies.find((reply) => reply._id.toString() === replyId);
        if (!reply) {
            return res.status(404).json({ error: "Reply not found" });
        }

        if(post.postedBy.toString() !== req.user._id.toString()) return res.status(400).json({msg : "User not authorized"});

        const index = post.replies.findIndex(
            (reply) => reply._id.toString() === replyId.toString()
        );
        post.replies.splice(index, 1);
        await post.save();


        res.status(200).json({ msg: "Reply deleted successfully" , replies : post.replies });
    }catch(error){
        console.log(error);
        res.status(500).json({msg : "delete reply error"});
    }
}

const getFeedPosts = async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      const following = user.following;
  
      const feedPosts = await Postmodel.find({
        postedBy: { $in: [...following , userId]  } ,
      }).sort({ createdAt: -1 });
  
      if (feedPosts.length === 0) {
        return res.status(200).json({ msg: "Feed is empty", feedPosts: [] });
      }
  
      res.status(200).json({ msg: "Feed posts found", feedPosts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error while getting feed posts" });
    }
  };



export {createPost , getPost , deletePost , likeUnlikePost , replyPost , getFeedPosts , getOwnPosts , deleteReply}