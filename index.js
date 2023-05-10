const express = require("express");
var cors = require("cors");
const { getConnection } = require("./src/dbConnection");
const routes = require("./src/routes");
const { sendJsonResp, handleErr } = require("./src/utils");
const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res) => {
  try {
    const route = routes[req.url.split("?")[0]];
    if (route) route(req, res);
    else {
      const data = {
        status: "NOT_FOUND",
        desc: "server can't find the requested url",
        url: req.url,
      };
      sendJsonResp(res, data, 404);
    }
  } catch (err) {
    handleErr(err, res);
  }
})

app.listen(8080, function (req, res) {
  getConnection(()=> console.log(`CONNECTED TO DB`));
  console.log(`App listening to localhost:8080....`);
  console.log(`App started at ${new Date().toLocaleString("en-IN")}`);
});