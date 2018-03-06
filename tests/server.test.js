const request = require('supertest');

const app = require('../server').app;

test('return "Hello"', (done) => {
  request(app)
    .get('/')
    .expect((res) => {
      console.log(res.body);
      expect(res.body).toBe('Hello');
    })
    .expect('Hello')
    .expect(200)

    .end(done);
});
