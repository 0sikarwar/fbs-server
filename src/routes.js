const { addNewClient, getAllClient, getClient, deleteClient } = require("./cleintHelpers")

module.exports = {
  "/addnewclient": addNewClient,
  "/getallclient": getAllClient,
  "/getclient": getClient,
  "/deleteclient": deleteClient,
}
