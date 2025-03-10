const bcrypt = require("bcryptjs");  //import bcrypt to hash/encrypt passwords
const jwt = require("jsonwebtoken"); //import JWT tokens  - need to assign tokens to user upon successful login
const User = require("../models/userModel"); //import userSchema

//NEW USER LOGIC




const register = async (req, res) => {
    try {

        console.log("Register route hit! Request body:", req.body); //debug
        const {username, password, role} = req.body;

        //validate the input

        if(!username || !password) {
            return res.status(400).json({message: "Username and password required!"});
        }

        //check if user exists already
        const existingUser = await User.findOne({where: {username}});

        if(existingUser){
            return res.status(409).json({message: "User exists"});
        }

        //hash password
        const hashPwd = await bcrypt.hash(password, 10);

        //create new user
        // eslint-disable-next-line no-unused-vars
        const newUser = await User.create({
            username,
            password: hashPwd,
            role: role || 'user',
        });

        //success response 
        res.status(201).json({message: "User registered successfully!"});

    }catch (error) {
        console.error("Error:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

//USER LOGIN LOGIC

const login = async (req, res) => {
    try {
       
        console.log("Login route hit!")
        const {username, password} = req.body;

        //validate the input

        if(!username || !password) {
            return res.status(400).json({message: "Username and password required!"});
        }

        //check if user exists already
        const checkUser = await User.findOne({where: {username}});
        console.log(checkUser);
        if(!checkUser){
            return res.status(404).json({message: "Username or password incorrect"});
        }

        //check password
        const isPasswordValid = await bcrypt.compare(password, checkUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        //if pwd and username is correct, generate JWT token
        const token = jwt.sign(
            { userId: checkUser.id, role: checkUser.role },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }     
        );

        //success response
        res.status(200).json({
            accessToken: token,  // This is the JWT token you're sending to the frontend
            roles: checkUser.role // Send the user's role (as per frontend expectation)
        });


    } catch (error) {
        console.error('Error in login controller:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
    
     
};

module.exports = {
    register,
    login
};