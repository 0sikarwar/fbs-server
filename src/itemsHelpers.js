const { executeQuery } = require("./dbConnection");
const { insertQuery } = require("./dbHelper");
const { sendJsonResp } = require("./utils");

const addItems = async (req, res) => {
  try {
    const body = req.body
    body.enterDataFields.forEach((fields) => {
      fields.categories = fields.categories.map(obj => obj.value).join(',')
      fields.client_id = body.client_id
    })
    const result = await insertQuery(body.enterDataFields, "items", true)
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
        data.msg = `Item altready exsits with name=${entry[0]}'`
      }
      sendJsonResp(res, data, 400);
  }
  } catch (e) {
    const data = {
      msg : e.sqlMessage || e.message,
      code : e.code || "SOMETHIN WENT WRONG"
    }
    sendJsonResp(res, data, 400);
    console.error("ERROR IN VIEW ITEMS", e)
  }
  
}

const viewItems = async (req, res) => {
  const { query } = req
  try {
    const sql = `select * from items where client_id=${query.id}`;
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
    console.error("ERROR IN VIEW ITEMS", e)
  }
}


module.exports = {addItems, viewItems}