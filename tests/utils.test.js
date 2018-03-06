//  sudo docker run -it --rm --name node -v /vagrant/node:/usr/src/app -w /usr/src/app ulrellik/node-dev:1.0 npm test
const utils = require('./utils');

test('Should add two numbers', () => {
  expect(utils.add(1,2)).toBe(3);
  expect(utils.add(1,2)).not.toBe(4);
  console.log('OK');
});

test('Should async add two numbers', (done) => {
  utils.asyncAdd(1,2,(sum) =>{
    expect(utils.add(1,2)).toBe(3);
    done();
  });
});
