/*
*       
*       To run the tests, open the terminal with [Ctrl + `] (backtick)
*       and run the command `npm run test`
*
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const dns = require('dns');
const url = require('url'); 
let testShortURL;

chai.use(chaiHttp);

suite('Functional Tests', () => {

  suite('Routing Tests', () => {
    
    suite('POST /api/shorturl/new/ => shortened URL JSON', () => {
      
      test('Returns a shortened URL in the JSON response', done => {
        const testURL = 'https://www.google.com';

        chai.request(server)
          .post('/api/shorturl/new')
          .send({ url: testURL })
          .end((err, res) => {
            const { original_url, short_url } = res.body;
            testShortURL = short_url.toString(); // Store short URL for later tests and convert to string if necessary

            const parsedLookupUrl = url.parse(testShortURL);

            assert.strictEqual(original_url, testURL);

            // Ensure returned short address is not a valid URL
            dns.lookup(parsedLookupUrl.hostname,(err, address, family) => {
              assert.isNull(address);
              done();
            });
          });
      });

      test('Returns expected error message for an invalid URL', done => {
        const testBadURL = 'https://wwwwdotgoogledotcom';

        chai.request(server)
          .post('/api/shorturl/new')
          .send({ url: testBadURL })
          .end((err, res) => {
            assert.deepStrictEqual(res.body, { error: 'Invalid URL' });
            done();
          });
      });
      
    });

    suite('GET /api/shorturl/[number] => shortened URL JSON', () => {
      
      test('Redirects a previously shortened URL', done => {
        chai.request(server)
          .get(`/api/shorturl/${testShortURL}`)
          .end((err, res) => {
            assert.deepStrictEqual(res.redirects, [ 'https://www.google.com/' ]);
            done();
          });
      });

      test('Returns expected error message if short URL is not a number', done => {
        chai.request(server)
          .get(`/api/shorturl/test123`)
          .end((err, res) => {
            assert.deepStrictEqual(res.body, { error: 'Wrong format' });
            done();
          });
      });

      test('Returns expected error message if short URL is not found', done => {
        // Generate high number that's unlikely to be taken
        const max = 99999999999;
        const min = 90000000000;
        const randomHighNumber = Math.floor(Math.random() * (max - min) + min);

        chai.request(server)
          .get(`/api/shorturl/${randomHighNumber}`)
          .end((err, res) => {
            assert.deepStrictEqual(res.body, { error: 'No short URL found for the given input' });
            done();
          });
      });
      
    });

  });

});
