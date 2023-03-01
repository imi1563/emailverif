const domains = require('disposable-email-domains')
const disposableDomains = new Set(domains)

const checkDisposable = async (domain) => {
  if (disposableDomains.has(domain)) return 'Email was created using a disposable email service'
}
module.exports ={checkDisposable};
