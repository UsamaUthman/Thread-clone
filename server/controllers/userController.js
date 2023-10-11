import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import generateTokenAndSetCookie from '../utils/helpers/generteTokenandSetCookie.js';
import {v2 as cloudinary} from 'cloudinary';


const register = async (req, res) => {
    try{    
        const { name, email, username, password } = req.body;
        const userexists = await User.findOne({$or: [{email: email}, {username: username}]});
        if(userexists){
            return res.status(409).json({error: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            username,
            password: hashedPassword
        });
        await user.save();
        if(user){
            generateTokenAndSetCookie(user._id, res);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                bio: user.bio,
                profilePic: user.profilePic,
                followers: user.followers,
                following: user.following,
                success: true,
            });
        }else{
            res.status(400).json({error: "Invalid user data"});
        }
    }catch(error){
        console.log(error);
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ error: "Invalid username"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid password" });
        }

        generateTokenAndSetCookie(user._id, res);

        const { _id, name, email } = user;
        res.status(200).json({ _id, name, email, username , success: true , bio : user.bio , profilePic : user.profilePic , followers : user.followers , following : user.following});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while processing your request" });
    }
}

const followUnfollow = async (req, res) => {
    try {
        const { id } = req.params;
        const userTomodify = await User.findById(id);
        const user = await User.findById(req.user._id);

        
        if(id === req.user._id.toString()){
            return res.status(400).json({message: "You cannot follow yourself"});
        }

        if(!userTomodify){
            return res.status(400).json({message: "User not found"});
        }

        const isFollowing = user.following.includes(id);

        if (isFollowing) {
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
        } else {
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
        }
        // Fetch the updated user after the operations
        const updatedUser = await User.findById(req.user._id);

        updatedUser.password = null;


        res.status(200).json({ user: updatedUser, message: isFollowing ? "Unfollowed successfully" : "Followed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while processing your request" });
    }
}


const update = async (req, res) => {
    const { name, email, username, password  , bio } = req.body.data;
    let { profilePic } = req.body;
    const userId = req.user._id;
    try{
        let user = await User.findById(userId);
        if(!user){
            return res.status(400).json({message: "User not found"});
        }
        
        if(req.params.id !== userId.toString()){
            console.log(userId.toString())
            return res.status(400).json({message: "You are not authorized to update this user"});
        }

        if(profilePic){
            if(user.profilePic){
                await cloudinary.uploader.destroy(user.profilePic.split("/")[7].split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profilePic);
            profilePic = uploadedResponse.secure_url;
        }
        

        if(password){
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        user = await user.save();

        user.password = null;
        res.status(200).json({
            message: "Profile updated successfully",
            user
        });
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "error in update profile" });
    }
}


const getUser = async(req , res) => {
    const {username} = req.params
    try{
        const user = await User.findOne({username}).select("-password").select("-updatedAt")
        if(!user){
            return res.status(404).json({error : "user not found"})
        }
        res.status(200).json({user})
    }catch(error){
        console.log(error)
        res.status(500).json({message : "error in get user"})
    }
}
const getUserById = async(req , res) => {
    const {id} = req.params
    try{
       const user = await User.findById(id).select("-password").select("-updatedAt")
         if(!user){
              return res.status(404).json({error : "user not found"})
         }
        res.status(200).json({user})
    }catch(error){
        console.log(error)
        res.status(500).json({message : "error in get userById"})
    }
}

const getAllUsers = async (req, res ) =>{
    try{
        const users = await User.find({}).select("-password").select("-updatedAt").select("-email").select("-following")
        res.status(200).json({users})

    }catch(error){
        console.log(error)
    }
}





export { register , login , logout , update , followUnfollow , getUser , getUserById , getAllUsers }