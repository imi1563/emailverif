const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const emailValidator = require('./index');
const randomstring = require('randomstring');
const smTp=require('./smtp/smtp');
const dotenv=require('dotenv');
dotenv.config();
const HttpsProxyAgent = require('https-proxy-agent');
const https = require('https');

const proxyUrl = 'http://cnhjfhlo:jx9lodr1mr50@193.8.138.128:9167'; // replace with your proxy URL
const agent = new HttpsProxyAgent(proxyUrl);

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
  try {
    const email = req.body.gmail;
    const isValid = await emailValidator.validate(email);
    console.log('isValid', isValid);
  
    if (isValid.valid) {
      const domain = email.split('@')[1];
      const emailAddress = `${randomstring.generate(10)}@${domain}`;
      console.log('domain', domain);
      console.log('emailAddress', emailAddress);
  
      const options = {
        hostname: 'example.com', // replace with the domain you're making a request to
        path: '/', // replace with the path you're making a request to
        method: 'GET',
        agent: agent // set the agent to the HttpsProxyAgent instance
      };
  
      const request = https.request(options, (response) => {
        console.log('statusCode', response.statusCode);
  
        response.on('data', (data) => {
          console.log('data', data);
          // do something with the response data
        });
  
        response.on('end', async() => {
          var isCatch = await emailValidator.validate(emailAddress);
          console.log('isCatch', isCatch);
          if (isCatch.valid) {
            res.render('verifySingle', { info: 'Catch-All' });
          } else {
            res.render('verifySingle', { info: 'Valid' });
          }
        });
      });
  
      request.on('error', (error) => {
        console.error(error);
        res.render('verifySingle', { info: error });
      });
  
      request.end();
    } else {
      res.render('verifySingle', { info: 'Invalid' });
    }
  } catch (error) {
    console.error(error);
    res.render('verifySingle', { info: error });
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



var port = process.env.PORT || 4500;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
