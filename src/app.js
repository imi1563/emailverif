const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const emailValidator = require('./index');
const randomstring = require('randomstring');
const smTp=require('./smtp/smtp');
const dotenv=require('dotenv');
dotenv.config();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', (req, res)=> {
  res.render('verifyBulk',{title:'Bulk Domain Validator',text:'',flag:false});

})

app.get('/single', (req, res) => {
  res.render('verifySingle',{info:''});
})
app.post('/verifysingle',async(req, res) => {
try{
var email=req.body.gmail;
var isValid=await emailValidator.validate(email);
if(isValid.valid){
  const domain = email.split('@')[1];
  const emailAddress = `${randomstring.generate(10)}@${domain}`;
  console.log("domen",domain);
  console.log("Email Address",emailAddress);
  var isCatch=await emailValidator.validate(emailAddress);
  console.log("Is Catch ",isCatch);
  if(isCatch.valid){
    res.render('verifySingle',{info:`Catch-All`});
  }else if(!isCatch.valid){
    res.render('verifySingle',{info:`Valid`});
  }
}else{
  res.render('verifySingle',{info:`Invalid`});
}
}catch(error){
  res.render('verifySingle',{info:error});
}
});

//bulk email verification

app.post('/verifybulk',async(req,res)=>{
  const email = req.body.emails;
      const lines = email.split(/\n/);
      const output = lines.filter(line => /\S/.test(line)).map(line => line.trim());
      console.log("out",output);
      const valid=[];
      const invalid=[];
      const acceptAllEmails = [];
      for (const email of output) {
    
    
        try {
          var isValid=await emailValidator.validate(email);
          console.log("valid")
          if(isValid.valid){
            const domain = email.split('@')[1];
            const emailAddress = `${randomstring.generate(10)}@${domain}`;
            var catchAll=await emailValidator.validate(emailAddress);
            if(catchAll.valid){

              acceptAllEmails.push(`${email}`);
            }
            if(catchAll.valid==false){
              valid.push(`${email}`);
            }
          }
          else{
            
            invalid.push(`${email}`);
          }
        } catch (err) {
          console.error(`Error verifying email ${email}: ${err}`);
        }
      }
    var data={
      acceptall:acceptAllEmails,
      v:valid,
      inv:invalid

    }
      console.log("....",data);
      res.render('verifyBulk',{title:'Bulk Domain Validator',text:data,flag:true});
})



var port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
