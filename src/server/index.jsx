import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SPA React</title>
      <script src="/client/index.js" defer></script>
    </head>
    <body>
      <div id="root"></div> 
    </body>
    </html>
  `);
});

app.use(express.static("dist"));

app.listen(3000, () => {
  console.log("Server up!");
});
