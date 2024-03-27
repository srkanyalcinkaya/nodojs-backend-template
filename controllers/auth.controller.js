const User = require("../models/user.model")
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../middleware/nodemailer.middleware");
require('dotenv').config()

// Controller function for user input
const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {

        // Find user by email address
        const user = await User.findOne({ email });

        // Send error if user not found
        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı", success: false });
        }

        //Check the user's password
        const passwordMatch = await bcrypt.compare(password, user.password);

        // Send error if password does not match
        if (!passwordMatch) {
            return res.status(401).json({ message: "Yanlış parola", success: false });
        }

        // User login successful, create JWT
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "3d" });

        // Send JWT to user

        return res.status(200).json({
            message: "Login success",
            success: true,
            user_id: user._id,
            token,
            name: user.name,
            surname: user.surname,
            email: user.email,
            credit: user.credit
        });
    } catch (error) {
        // In case of any error, send a general error message
        console.error("Login error:", error);
        return res.status(500).json({ message: "Sunucu hatası", success: false });
    }
};


const registerController = async (req, res) => {
    const { name, surname, email, password } = req.body;
    try {
        // Check if the user's email address is present in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Bu e-posta adresi zaten kullanılmaktadır.", success: false });
        }

        // Hash the password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10)


        //Create new user
        const newUser = await User.create({
            name,
            surname,
            email,
            password: hashedPassword, // Add the hashed password to the user record
        });

        // User login successful, create JWT
        const token = jwt.sign({ userId: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "3h" });

        // Send verification email
        await sendVerificationEmail(email, newUser._id);

        // Send successful registration message and JWT to user
        return res.status(201).json({
            message: "Kullanıcı başarıyla kaydedildi",
            success: true,
            user_id: newUser._id,
            token,
            name: newUser.name,
            surname: newUser.surname,
            email: newUser.email,
        });
    } catch (error) {
        // In case of any error, send a general error message
        console.error("Register error:", error);
        return res.status(500).json({ message: "Sunucu hatası" });
    }
};



const verifyEmailController = async (req, res) => {
    const {_id} = req.params;
    try {
    
        // Find the user by the verification token
        const user = await User.findById({_id:_id});
        if (!user) {
            // User not found
            return res.status(400).send({ message: "User not found. Already verified or token expired." });
        }

        if (user.isEmailVerification) {
            // User already verified
            return res.status(200).json({ message: "Email already verified." });
        }
        // Update the user's verification status
        user.isEmailVerification = true;

        // Save the user to the database
        await user.save();

        res.status(200).json({ message: 'Email verification successful.' });
    } catch (error) {
        
        res.status(400).json({ message: 'Error', error: error.message });
    }
};


module.exports = { loginController, registerController, verifyEmailController }