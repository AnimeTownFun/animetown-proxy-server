const http = require("http");
const https = require("https");
const httpProxy = require("http-proxy");
const url = require("url");
const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  const targetUrl = req.url.slice(1); // Remove the leading '/'

  const targetProtocol = targetUrl.startsWith("https") ? https : http;

  // Create a new request to the target server
  const targetRequest = targetProtocol.request(targetUrl, (targetResponse) => {
    res.writeHead(targetResponse.statusCode, targetResponse.headers);
    targetResponse.pipe(res, { end: true });
  });

  targetRequest.on("error", (err) => {
    console.error(err);
    res.writeHead(500, {
      "Content-Type": "text/plain",
    });
    res.end("Proxy Error");
  });

  req.pipe(targetRequest, { end: true });
});

server.listen(3000, () => {
  console.log("Proxy server listening on port 3000");
});
