const express = require('express')
const router = express.Router();

const item = require('./../models/item')



router.get('/:name', async (req,res) => {
  try{
    const name = req.params.name;
    const response = await item.findOne({name: name})
    if(!response){
      return res.status(404).json({message: 'item not found!'})
    }else{
      return res.status(200).json({response: response})
    }
  }catch(err){
    console.log(err)
    res.status(500).json({error : "internal error"})
  }
})

router.post('/add' , async (req,res) => {
  try{
    const data = req.body;
    const newitem = await item(data).save();
    res.status(200).json({message:"item added successfully",data:newitem})
  }catch(err){
    console.log(err)
    res.status(500).json({error : "internal error"})
  }
})

router.get('/', async (req,res) => {
  try{
    const response = await item.find({} , 'name price quantity -_id');
    res.status(200).json({message:"items fetched successfully",data:response})
  }catch(err){
    console.log(err)
    res.status(500).json({error : "internal error"})
  }
})

router.put('/update/:name',async (req,res) => {
    try{
        const itemname = req.params.name;
        const data = req.body;
        const updatedItem = await item.findOneAndUpdate(
          { name: itemname },  
          data,              
          { runValidators: true , new: true }     
        );
        if(updatedItem){
  
          res.status(200).json({message:"item updated successfully",data:updatedItem})
        }else{
          res.status(404).json({message:"item not found"})
        }
    }catch(err){
      console.log(err)
      res.status(500).json({error : "internal error"})
    }
})


module.exports = router;