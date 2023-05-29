const { executeQuery } = require("./dbConnection");
const { insertQuery, updateQuery } = require("./dbHelper");
const { getTableStatus, getCartTableName, updateCartTable } = require("./orderTableHelper");
const { sendJsonResp } = require("./utils");

const addItems = async (req, res) => {
  try {
    const body = req.body;
    body.enterDataFields.forEach((fields) => {
      fields.categories = Array.isArray(fields.categories)
        ? fields.categories.map((obj) => obj.value).join(",")
        : fields.categories.value;
      fields.client_id = body.client_id;
    });
    const result = await insertQuery(body.enterDataFields, "items");
    if (!result.isError && result.affectedRows) {
      const data = {
        clientAdded: result.affectedRows,
      };
      sendJsonResp(res, data, 200);
    } else {
      const data = {
        msg: result.msg || `something went wrong please try again`,
        code: result.code,
      };
      if (data.code === "ER_DUP_ENTRY") {
        const errWords = data.msg.split(" ");
        const entry = errWords[2].split("-");
        data.msg = `Item altready exsits with name=${entry[0]}'`;
      }
      sendJsonResp(res, data, 400);
    }
  } catch (e) {
    const data = {
      msg: e.sqlMessage || e.message,
      code: e.code || "SOMETHIN WENT WRONG",
    };
    sendJsonResp(res, data, 400);
    console.error("ERROR IN VIEW ITEMS", e);
  }
};

const viewItems = async (req, res) => {
  const { query } = req;
  try {
    const sql = `select * from items where client_id=${query.id}`;
    let result = await executeQuery(sql);
    const data = {
      list: result,
    };
    sendJsonResp(res, data, 200);
  } catch (e) {
    const data = {
      msg: e.sqlMessage || e.message,
      code: e.code || "SOMETHIN WENT WRONG",
    };
    sendJsonResp(res, data, 400);
    console.error("ERROR IN VIEW ITEMS", e);
  }
};

const addItemInCart = async (req, res) => {
  console.log("addItemInCart");
  const { body } = req;
  const { client_id, table_id, cart } = body;
  try {
    const tableStatus = await getTableStatus(client_id, table_id);
    console.log("tableStatus", tableStatus);
    if (tableStatus === "busy") {
      const cartTableName = await getCartTableName(client_id, table_id);
      console.log("cartTableName", cartTableName);
      if (cartTableName) {
        const list = await updateCartTable(cart, cartTableName);
        if (list) {
          sendJsonResp(res, { list, client_id, table_id }, 200);
        } else {
          throw new Error("something went wrong");
        }
      }
    }
  } catch (e) {
    console.log("e", e);
  }
};

const getCartData = async (req, res) => {
  const { query } = req;
  try {
    const sqlCheckTable = `SHOW TABLES LIKE 'cart_${query.cid}_${query.tid}'`;
    let checkTableResult = await executeQuery(sqlCheckTable);
    if (checkTableResult.length) {
      const sql = `select * from cart_${query.cid}_${query.tid}`;
      let result = await executeQuery(sql);
      const itemSql = `select * from items where client_id=${query.cid}`;
      const itemResult = await executeQuery(itemSql);
      let orderAmount = 0, totalOrderedItem = 0, totalCartItem = 0
        cartAmount = 0;
      result.forEach((cartObj) => {
        const item = itemResult.find((obj) => obj.id === cartObj.item_id);
        if (cartObj.status === "ordered") {
          orderAmount += item[cartObj.price_type];
          totalOrderedItem+=cartObj.item_count;
        } else {
          cartAmount += item[cartObj.price_type];
          totalCartItem++;
        }
      });
      const data = {
        list: result,
        orderAmount,
        cartAmount,
        totalOrderedItem,
        totalCartItem
      };
      sendJsonResp(res, data, 200);
    } else {
      sendJsonResp(res, {}, 200);
    }
  } catch (e) {
    const data = {
      msg: e.sqlMessage || e.message,
      code: e.code || "SOMETHIN WENT WRONG",
    };
    sendJsonResp(res, data, 400);
    console.error("ERROR IN GET CART DATA", e);
  }
};

const placeOrder = async (req, res) => {
  try {
    const { body } = req;
    const { cart, client_id, table_id } = body;
    const promiseArr = [];
    for (let i = 0; i < cart.length; i++) {
      const conditionObj = { item_id: cart[i].item_id, price_type: cart[i].price_type, status: cart[i].status };
      promiseArr.push(updateQuery({ status: "ordered" }, `cart_${client_id}_${table_id}`, conditionObj));
    }
    let flag = false;
    await Promise.all(promiseArr)
      .then((values) => {
        if (values.isError) {
          sendJsonResp(res, values, 400);
        }
        const sql = `select * from cart_${client_id}_${table_id}`;
        executeQuery(sql)
          .then((result) => {
            const data = {
              list: result,
            };
            flag = true;
            sendJsonResp(res, data, 200);
          })
          .catch((e) => {
            throw e;
          });
      })
      .catch((e) => {
        throw e;
      });
  } catch (e) {
    const data = {
      msg: e.sqlMessage || e.message,
      code: e.code || "SOMETHING WENT WRONG",
    };
    sendJsonResp(res, data, 400);
    console.log("ERROR IN PLACE ORDER", e);
  }
};

module.exports = { addItems, viewItems, addItemInCart, getCartData, placeOrder };
