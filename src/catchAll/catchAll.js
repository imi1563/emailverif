
const randomstring = require('randomstring');
const configar=require('../index')

const catchAllCheck = async (email) => {
  const domain = email.split('@')[1];
  const emailAddress = `${randomstring.generate(10)}@${domain}`;
  console.log("domen",domain);
  console.log("Email Address",emailAddress);
  var isValid=await configar.validate(email);
  console.log("isvladfadsf",isValid);
}
module.exports ={catchAllCheck};

