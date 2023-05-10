const { insertQuery } = require("./dbHelper");
const { sendJsonResp } = require("./utils");

const addNewClient = async (req, res) => {
  const body = req.body
  const result = await insertQuery(body, "Clients", true)
  if (!result.isError && result.affectedRows) {
    const data = {
      msg: `SUCCESS`,
      clientAdded: result.affectedRows
    }
    sendJsonResp(res, data, 200);
  } else {
    const data = {
      msg: result.msg || `something went wrong please try again`,
      code: result.code
    }
    sendJsonResp(res, data, 400);
  }
}

module.exports = {
  addNewClient
}