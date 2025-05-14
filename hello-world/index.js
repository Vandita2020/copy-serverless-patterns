require('http').createServer((req, res) => {
  res.writeHead(200, {
      'Content-Type': 'text/plain'
  });
  res.end('Hello Lite CLI!')
}).listen(3000);
