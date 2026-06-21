const http = require('http');

const req = http.request({
  hostname: '127.0.0.1',
  port: 3000,
  path: '/',
  method: 'GET',
  headers: {
    'Host': 'ais-dev-szczz23oxv5ny54pxy5tq7-13147232563.europe-west2.run.app'
  }
}, (res) => {
  console.log('STATUS:', res.statusCode);
  res.on('data', d => process.stdout.write(d.toString().substring(0, 100)));
});
req.on('error', e => console.error(e));
req.end();
