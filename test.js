const dns = require('dns');
const url = require('url'); 
const lookupUrl = "https://stackoverflow.com/questions/41942690/removing-http-or-http-and-www/41942787";
// const lookupUrl = "lksjdof092"

const parsedLookupUrl = url.parse(lookupUrl);

dns.lookup(parsedLookupUrl.hostname,(error, address, family) => {
  console.log(error, address, family);
});
