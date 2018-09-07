const { request } = require('https');
const { parse } = require('url');

module.exports = url => new Promise((resolve, reject) => {
  const req = request(parse(url), (res) => {
    const data = [];
    res.on('data', d => data.push(d));
    res.on('end', () => (res.statusCode < 400
      ? resolve(data.join(''))
      : reject(new Error(data.join('')))));
  });
  req.on('error', reject);
  req.end();
});
