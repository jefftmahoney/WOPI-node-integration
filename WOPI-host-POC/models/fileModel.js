const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FileSchema = new Schema({
  fileName: { type: "String" },
  data: {}
});

const File = (module.exports = mongoose.model("File", FileSchema));
