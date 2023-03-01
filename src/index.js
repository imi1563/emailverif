const { isEmail } = require('./regex/regex');
const { checkTypo } = require('./typo/typo');
const { getBestMx } = require('./dns/dns');
const { checkSMTP } = require('./smtp/smtp');
const { checkDisposable } = require('./disposable/disposable');
const { getOptions, ValidatorOptions } = require('./options/options');
const { createOutput, OutputFormat } = require('./output/output');
const catchAll=require('./catchAll/catchAll')
require('./types');


async function validate(emailOrOptions) {
  const options = getOptions(emailOrOptions);
  const email = options.email;
  const mail= options.email;
console.log(".......",mail);
  if (options.validateRegex) {
    const regexResponse = isEmail(email);
    if (regexResponse) return createOutput('regex', regexResponse);
  }

  if (options.validateTypo) {
    const typoResponse = await checkTypo(email, options.additionalTopLevelDomains);
    if (typoResponse) return createOutput('typo', typoResponse);
  }

  const domain = email.split('@')[1];

  if (options.validateDisposable) {
    const disposableResponse = await checkDisposable(domain);
    if (disposableResponse) return createOutput('disposable', disposableResponse);
  }

  if (options.validateMx) {
    const mx = await getBestMx(domain);
    if (!mx) return createOutput('mx', 'MX record not found');
    if (options.validateSMTP) {
      return checkSMTP(options.sender, email, mx.exchange);
    }
  }
  return createOutput();
}

module.exports = {
  validate
};
