/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
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
            testShortURL = short_url; // Store number for later test

            assert.strictEqual(original_url, testURL);
            assert.typeOf(short_url, 'number');
            done();
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
        const max = 9999999999;
        const min = 9000000000;
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
