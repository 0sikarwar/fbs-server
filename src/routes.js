const { addNewClient, getAllClient, getClient, deleteClient } = require("./cleintHelpers")
const { addItems, viewItems } = require("./itemsHelpers")

module.exports = {
  "/addnewclient": addNewClient,
  "/getallclient": getAllClient,
  "/getclient": getClient,
  "/deleteclient": deleteClient,
  "/additems": addItems,
  "/viewitems": viewItems,
}
