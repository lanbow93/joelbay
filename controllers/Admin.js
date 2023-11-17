const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Admin = require("../models/Admin");
const {successfulRequest, failedRequest} = require("../utils/SharedFunctions")

// // Admin Signup Post
// router.post("/signup", async (request, response) => {
//     try{
//         // Hash password
//         request.body.password = await bcrypt.hash(request.body.password, await bcrypt.genSalt(10))

//         // Generate user
//         const admin = await Admin.create({username: request.body.username, password: request.body.password})

//         // Response
//         response.json({status: "Admin Created", username: admin})
//     } catch (error) {
//         response.status(400).json(error)
//     }
// })

// Admin Login Post
router.post("/login", async (request, response) => {
    try {
        const {username, password} = request.body
        //Check for user
        const user = await Admin.findOne({username})

        if (user){
            const passwordCheck = await bcrypt.compare(password, user.password)
            if(passwordCheck) {
                const payload = {username}
                const token = await jwt.sign(payload, process.env.SECRET)
                response.cookie("token", token, {
                    httpOnly: true,
                    path: "/",
                    sameSite: "none",
                    secure: request.hostname === "locahhost" ? false : true,}).json({payload, status: "logged in"})
            } else {
                failedRequest(response, "Failed To Login", "Username/Password Does Not Match", "Incorrect Password/Username")
            }
        } else {
            failedRequest(response, "Failed To Login", "Username/Password Does Not Match", "Incorrect Username/Password");
        }
    } catch(error) {
        failedRequest(response, "Failed To Login", "Username/Password Does Not Match", error);
    }

}) 

// Admin Logout Post
router.post("/logout", async (request, response) => {
    response.clearCookie("token").json({response: "You are Logged Out"})
})

module.exports = router