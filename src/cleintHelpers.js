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
    if (data.code === "ER_DUP_ENTRY") {
      const errWords = data.msg.split(" ");
      const entry = errWords[2].split('-');
      data.msg = `Client altready exsits with name=${entry[0]}' location='${entry[1]}`
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
const getClient = async (req, res) => {
  const { query } = req
  try {
    const sql = `select * from Clients where id=${query.id}`;
    let result = await executeQuery(sql);
    if(!result.length) throw({code:"INVALID ID", message:"wrong client id"})
    const data = {
      data: result[0]
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

const deleteClient = async (req, res) => {
  try{
  const body = req.body;
  const sql = `DELETE FROM Clients WHERE id=${body.id};`
  let result = await executeQuery(sql);
  if (result.affectedRows === 1) {
    sendJsonResp(res);
  } else {
    sendJsonResp(res, {}, 400);
  }
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
  getAllClient,
  getClient,
  deleteClient
}