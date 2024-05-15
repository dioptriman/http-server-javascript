const net = require("net");
const fs = require("fs");
const path = require("path");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    let responseJSON = data.toString().split("\r\n");
    const url = responseJSON[0].split(" ")[1];
    const method = responseJSON[0].split(" ")[0];

    // Url Manager
    if (url === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\nHello World");
    } else if (url.includes("/echo/")) {
      const echoUrl = url.split("/echo/")[1];
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length:${echoUrl.length}\r\n\r\n${echoUrl}`
      );
    } else if (url === "/user-agent") {
      userAgent = responseJSON[2].split("User-Agent: ")[1];
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`
      );
    } else if (url.includes("/files/") && method === "GET") {
      const dir = process.argv[3];
      const fileName = url.split("/files/")[1];
      const filePath = path.join(dir, fileName);

      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, { encoding: "utf-8" });
        socket.write(
          `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${data.length}\r\n\r\n${data}`
        );
      } else {
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      }
    } else if (url.includes("/files/") && method === "POST") {
      const dir = process.argv[3];
      const fileName = url.split("/files/")[1];
      const filePath = path.join(dir, fileName);

      fs.writeFile(filePath, requestBody, (err) => {
        if (err) {
          socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n");
        } else {
          socket.write("HTTP/1.1 201 Created\r\n\r\n");
        }
        socket.end();
      });
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
