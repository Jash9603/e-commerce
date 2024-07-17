const express = require('express')
const router = express.Router()
const item = require('./../models/item')
const user = require('./../models/user')


router.post('/:name/:quantity/:username', async (req, res) => {
  try {
    const name = req.params.name;
    const quantity = parseInt(req.params.quantity, 10);
    const username = req.params.username;

    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const loggedinperson = await user.findOne({ username:username });
    const selecteditem = await item.findOne({ name });

    if (!loggedinperson) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!selecteditem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (selecteditem.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient item quantity' });
    }

    selecteditem.quantity -= quantity;

    const response = {
      name: name,
      quantity: quantity,
      price: selecteditem.price
    };

    await selecteditem.save();
    await loggedinperson.addtocart(response);

    res.status(200).json({ message: 'Item added', response: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
});



router.get('/:name', async (req,res) => {
  try{
    const username = req.params.name;
    const loggedinuser = await user.findOne({ username });
    if (!loggedinuser) {
      return res.status(404).json({ error: 'User not found' });
      }
      const cart = loggedinuser.cart;
      let itemtotal = loggedinuser.total;
      const cartitems = cart.map(item => {
        return {name : item.name, quantity: item.quantity}
      });
      res.status(200).json({ message: 'Cart items', cartitems: cartitems , total : itemtotal});
      
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
  
})


module.exports = router;