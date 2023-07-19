import importList from "../utils/importList.js";

const emails = await importList("data/emailList.csv")
console.table(emails)