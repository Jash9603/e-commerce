const express = require('express')
const router = express.Router();
const user = require('./../models/user')
//create a route which return me perticular user searched by its username
const passport = require('./../auth')

const session = require('express-session');



router.use(passport.initialize());
router.use(passport.session());






router.get('/:username',async (req, res) => {
  
  const respose = await user.findOne({username: req.params.username})
  res.json(respose);

})


router.get('/admin/users',async (req,res) => {
  try{
  const respose = await user.find()
  res.json(respose);
  }catch(err){
    console.log(err)
    res.status(500).json({error : "internal error"})
  }
})


  

router.put('/update/password', async(req, res) => {
  try{
   const {username,password,newpass} = req.body;
  const updateuser = await user.findOne({username:username})

   if(updateuser){
    const ismatch = await updateuser.comparepassword(password)
      if(ismatch){
        updateuser.password = newpass;
        await updateuser.save();
        res.status(200).json(updateuser);
      }
    
   }
  }catch(err){
    console.log(err)
    res.status(500).json({error : "internal error"})
  }
})

module.exports = router;