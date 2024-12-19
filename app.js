const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  if (req.url == "/" && req.method === "GET") {
    fs.readFile("values.txt", "utf8", (err, data) => {
      if (err) {
        fs.writeFileSync("values.txt", "");
        data = "";
      }

      res.setHeader("Content-Type", "text/html");
      res.end(`
        <form action="/" method="POST">
          <h2>Current Value: ${data}</h2>
          <label for="name">Name:</label>
          <input type="text" id="name" name="username" />
          <button type="submit">Add</button>
        </form>
      `);
    });
  } else if (req.url == "/" && req.method === "POST") {
    let dataChunks = [];

    req.on("data", (chunk) => {
      dataChunks.push(chunk);
    });

    req.on("end", () => {
      let combinedBuffer = Buffer.concat(dataChunks);
      let value = combinedBuffer.toString().split("=")[1];

      fs.writeFile("values.txt", value, (err) => {
        if (err) {
          console.error("Error writing to file", err);
          return;
        }

        res.statusCode = 302;
        res.setHeader("Location", "/");
        res.end();
      });
    });
  } else {
    res.statusCode = 404;
    res.end("Page Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
