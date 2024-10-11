import type { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';

// const { registerValidation, loginValidation } = require('../validations/auth')
// const User = require("../models/UserModel")
// const bcryptjs = require('bcryptjs');
// const jwt = require('jsonwebtoken')
// const { renameSync, unlinkSync } = require('fs')

// expiryy date in 3 days
// const maxAge = 3 * 24 * 60 * 60 * 1000
// const createToken = (email, userId) => {
//   return jwt.sign({ email, userId }, process.env.JWT_SECRET, {
//     expiresIn: maxAge
//   })
// }

// #region SIGNUP USER
// @desc signup user
// @route POST /api/users/signup
//
export  const signup = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    const { email, password } = req.body
    const user = await User.create({ email, password })
    
    // res.cookie('jwt', createToken(email, user._id), {
    //   maxAge, secure: true,
    //   sameSite: 'None'
    // })
    return res.status(201).json(res);
  },
);

// const login = async (req, res, next) => {
//   const { email, password } = req.body
//   const user = await User.findOne({ email })
//   if (!user) return res.status(500).send('User not found')

//   try {
//     const isCorrectPass = await bcryptjs.compare(password, user.password)
//     if (!isCorrectPass) return res.status(500).send('Incorrect Password')

//     res.cookie('jwt', createToken(email, user._id), {
//       maxAge, secure: true,
//       sameSite: 'None'
//     })
//     return res.status(200).json({ user })
//   } catch (error) {
//     console.log(error)
//     return res.status(500).send('internal server error')
//   }
// }

// const getUserInfo = async (req, res, next) => {

//   try {
//     const userId = req.userId
//     const userInfo = await User.findById(userId)
//     if (!userInfo) return res.status(500).send('User not found')

//     return res.status(200).json(userInfo)
//   } catch (error) {
//     console.log(error)
//     return res.status(500).send('internal server error')
//   }
// }
// const updateProfile = async (req, res, next) => {

//   try {
//     const userId = req.userId
//     const { firstName, lastName, color } = req.body
//     const profileSetup = true

//     const userInfo = await User.findByIdAndUpdate(userId, {
//       firstName, lastName, color, profileSetup
//     }, { new: true })
//     if (!userInfo) return res.status(500).send('User not found')

//     return res.status(200).json(userInfo)
//   } catch (error) {
//     console.log(error)
//     return res.status(500).send('internal server error')
//   }
// }

// const addProfileImage = async (req, res, next) => {
//   console.log('request:', req)
//   try {
//     if (!req.file) return res.status(400).send('File is required')

//     const { originalname, path } = await req.file
//     const date = Date.now()

//     let fileName = `uploads/profiles/${date}${originalname}`
//     renameSync(path, fileName)

//     const userId = req.userId
//     const updatedUser = await User.findByIdAndUpdate(userId, {
//       image: fileName
//     }, { new: true, runValidators: true })

//     if (!updatedUser) return res.status(500).send('User not found')

//     return res.status(200).json({ image: updatedUser.image })
//   } catch (error) {
//     console.log(error)
//     return res.status(500).send('internal server error')
//   }
// }

// const removeProfileImage = async (req, res, next) => {

//   try {
//     const userId = req.userId

//     const user = await User.findById(userId)
//     if (!user) return res.status(500).send('User not found')

//     if (user.image) unlinkSync(user.image)
//     user.image = null
//     await user.save()
//     return res.status(200).send('Profile image removed successfully')
//   } catch (error) {
//     console.log(error)
//     return res.status(500).send('internal server error')
//   }
// }
 