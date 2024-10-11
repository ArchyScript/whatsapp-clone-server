


const User = require("../models/UserModel")
  
 

const searchContacts = async (req, res, next) => {

  try {
    const userId = req.userId
    const userInfo = await User.findById(userId)
    if (!userInfo) return res.status(500).send('User not found')

    return res.status(200).json(userInfo)
  } catch (error) {
    console.log(error)
    return res.status(500).send('internal server error')
  }
} 


module.exports = {  searchContacts,   }