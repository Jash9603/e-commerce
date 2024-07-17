const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number, required: true
  },
  mobile: {
    type: String, required: true,unique: true
  },
  email: {
    type: String, required: true, unique: true
  },
username:{
  type: String, require:true, unique : true
},
password:{
  type: String, require:true
},
cart:{
  type: Array,
  default: ['empty']
},
total:{
  type: Number,
  default : 0
}
});

userSchema.methods.addtocart = async function(obj) {
  this.cart.push(obj);
  this.total = this.total + (obj.price*obj.quantity);
  await this.save();
  return this.cart;


}

userSchema.methods.comparepassword = async function(candidatepassword) {
  return await bcrypt.compare(candidatepassword,this.password)
}

userSchema.pre('save', async function (next) {
  const user = this;
  if(!user.isModified('password')) return next();
   try{
     const salt = await bcrypt.genSalt(10);
     const hash = await bcrypt.hash(user.password, salt);
     user.password = hash;
   }catch(err){
    return next(err);

   }
  
})


//create model
const user = mongoose.model('user', userSchema);
module.exports = user;

