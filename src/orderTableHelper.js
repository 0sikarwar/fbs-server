const { executeQuery } = require("./dbConnection");
const { insertQuery, updateQuery } = require("./dbHelper");

const getTableStatus = async (client_id, table_id) => {
  const sqlTableStatus = `select status from table_status where client_id=${client_id} and table_id=${table_id}`;
  let resultTableStatus = await executeQuery(sqlTableStatus);
  let status = ""
  if (!resultTableStatus.length){
    const resultInsetTableStatus = await insertQuery([{ client_id, table_id, status: "busy" }], "table_status")
    if (!resultInsetTableStatus.isError && resultInsetTableStatus.affectedRows) {
      status = "busy"
    } else {
      throw( new Error("Something went wrong"))
    }
  } else {
    const currentStatus = resultTableStatus[0].status;
    if (currentStatus !== "busy") {
      const updateTableStatus = await updateQuery({status: "busy"}, "table_status", {client_id, table_id})
      console.log('updateTableStatus', updateTableStatus)
      status = "busy"
    } else {
      status = "busy"
    }
  }
  return status
}

const getCartTableName = async (client_id, table_id) => { 
  const sqlTableStatus = `select cart_table_name from orders where client_id=${client_id} and table_id=${table_id} and status = 'busy'`;
  let resultTableStatus = await executeQuery(sqlTableStatus);
  let cartTableName = ""
  if (!resultTableStatus.length) { 
    const resultInsetTableStatus = await insertQuery([{ client_id, table_id, status: "busy", cart_table_name: `cart_${client_id}_${table_id}` }], "orders")
    if (!resultInsetTableStatus.isError && resultInsetTableStatus.affectedRows) {
      cartTableName = `cart_${client_id}_${table_id}`
    } else {
      throw( new Error("Something went wrong"))
    }
  }else {
   cartTableName = resultTableStatus[0].cart_table_name;
  }

  return cartTableName
}

const updateCartTable = async ( cart, cartTableName) => {
  const sqlCheckTable = `SHOW TABLES LIKE '${cartTableName}'`
  let checkTableResult = await executeQuery(sqlCheckTable);
  console.log('checkTableResult', checkTableResult)
  let createdTableFlag = false
  if (!checkTableResult.length) {
    const sqlCreateTable = `CREATE TABLE ${cartTableName} (
      item_id INTEGER NOT NULL,
      price_type varchar(5) NOT NULL,
      item_count INTEGER NOT NULL,
      status varchar(10),
      create_date varchar(64) NOT NULL,
      update_date varchar(64) NOT NULL
    )`
    let resultCreateTable = await executeQuery(sqlCreateTable);
    if(resultCreateTable) createdTableFlag = true
  }
  console.log('createdTableFlag', createdTableFlag)
  console.log('checkTableResult.length', checkTableResult.length)
  if (checkTableResult.length || createdTableFlag) {
    const sqlDeleteItems = `DELETE FROM ${cartTableName} WHERE status='cart'`
    console.log('sqlDeleteItems', sqlDeleteItems)
    let resultDeleteItem = await executeQuery(sqlDeleteItems);
    console.log('resultDeleteItem', resultDeleteItem)
    if (resultDeleteItem) {
      const updatedCart = cart.map((obj)=>({...obj, status: "cart"}))
      const insertResult = await insertQuery(updatedCart, cartTableName);
      console.log('insertResult', insertResult)
      if (!insertResult.isError && insertResult.affectedRows) { 
        const sqlSelect = `select * from ${cartTableName}`
        const selectResult = await executeQuery(sqlSelect);
        return selectResult;
      }
    }
  }

}

module.exports = {getTableStatus, getCartTableName, updateCartTable}