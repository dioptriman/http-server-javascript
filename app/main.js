const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    let responseJSON = data.toString().split("\r\n");
    const pathJson = responseJSON[0].split(" ")[1];

    // Path Manager
    if (pathJson === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\nHello World");
    } else if (pathJson.includes("/echo/")) {
      const contentPath = pathJson.split("/echo/")[1];
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length:${contentPath.length}\r\n\r\n${contentPath}`
      );
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      1;
    }
  });

  socket.on("close", () => {
    server.close();
  });
});

server.listen(4221, "localhost");
