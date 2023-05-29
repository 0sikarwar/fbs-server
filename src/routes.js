const { addNewClient, getAllClient, getClient, deleteClient } = require("./cleintHelpers")
const { addItems, viewItems, addItemInCart, getCartData, placeOrder } = require("./itemsHelpers")
const { viewTables, confirmPayment } = require("./orderTableHelper")

module.exports = {
  "/addnewclient": addNewClient,
  "/getallclient": getAllClient,
  "/getclient": getClient,
  "/deleteclient": deleteClient,
  "/additems": addItems,
  "/viewitems": viewItems,
  "/additemincart": addItemInCart,
  "/getcartdata": getCartData,
  "/placeorder": placeOrder,
  "/viewtables": viewTables,
  "/confirmpayment": confirmPayment
}
