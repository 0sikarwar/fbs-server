const { executeQuery } = require("./dbConnection");
const { insertQuery } = require("./dbHelper");
const { sendJsonResp } = require("./utils");

const addNewClient = async (req, res) => {
  const body = req.body
  const result = await insertQuery(body, "Clients", true)
  if (!result.isError && result.affectedRows) {
    const data = {
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
const getAllClient = async (req, res) => {
  try {
    const sql = "select * from Clients";
    let result = await executeQuery(sql);
    const data = {
      list: result
    }
    sendJsonResp(res, data, 200);
    
  } catch (e) {
    const data = {
      msg : e.sqlMessage || e.message,
      code : e.code || "SOMETHIN WENT WRONG"
    }
    sendJsonResp(res, data, 400);
    console.error("ERROR IN GET ALL CLIENT", e)
  }
}

module.exports = {
  addNewClient,
  getAllClient
}