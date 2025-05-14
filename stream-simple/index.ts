import http from 'node:http'
import fs from 'node:fs'

http.createServer((req, res) => {
  if (req.method !== 'GET') {
    res.writeHead(501);
    return res.end('Not implemented')
  }

  if (req.url == "/") {
    const stream = fs.createReadStream('index.html');
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    stream.pipe(res);
    stream
      .on('error', (error) => {
        console.error(error);
        res.end('Error occurred while streaming');
      })
      .on('close', () => {
        stream.destroy()
      });
    return;
  }

  if (req.url == '/chunks') {
    res.writeHead(200, {
      'Transfer-Encoding': 'chunked'
    });
    let count = 0;
    const delay = 800;
    const interval = setInterval(() => {
        res.write(`Chunk ${count}\n`);
        count++;
        if (count === 5) {
            setTimeout(() => {
              clearInterval(interval);
              res.end('Stream complete!');
            }, delay - 100);
        }
    }, delay);
    return;
  }

  res.writeHead(404);
  return res.end('Not found')
}).listen(process.env.PORT)
