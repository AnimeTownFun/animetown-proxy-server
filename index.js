const corsAnywhere = require("cors-anywhere");

const host = "0.0.0.0";
const port = 8080;

const server = corsAnywhere.createServer();

// Start the server
server.listen(port, host, () => {
  console.log(
    `CORS Anywhere reverse proxy is running on http://${host}:${port}`
  );
});
