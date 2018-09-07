'use strict';

const { request } = require('https');
const { parse } = require('url');

module.exports = (url, data) => new Promise((resolve, reject) => {

  const options = Object.assign(parse(url), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    },
  });

  const req = request(options, (res) => {
    const data = [];
    res.on('data', (d) => data.push(d));
    res.on('end', () =>
      res.statusCode < 400
      ? resolve(data.join(''))
      : reject(new Error(data.join('')))
    );
  });
  req.on('error', reject);
  req.write(data);
  req.end();

});
