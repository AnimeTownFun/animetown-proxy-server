const express = require("express");
const http = require("http");
const https = require("https");
const httpProxy = require("http-proxy");

const app = express();
const proxy = httpProxy.createProxyServer({});

app.use((req, res, next) => {
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
    res.sendStatus(200);
  } else {
    next();
  }
});

app.all("/:url(*)", (req, res) => {
  const targetUrl = req.params.url;

  const targetProtocol = targetUrl.startsWith("https") ? https : http;

  const targetRequest = targetProtocol.request(targetUrl, (targetResponse) => {
    res.writeHead(targetResponse.statusCode, targetResponse.headers);
    targetResponse.pipe(res, { end: true });
  });

  targetRequest.on("error", (err) => {
    console.error(err);
    res.sendStatus(500);
  });

  req.pipe(targetRequest, { end: true });
});

proxy.on("error", (err, req, res) => {
  console.error(err);
  res.sendStatus(500);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
