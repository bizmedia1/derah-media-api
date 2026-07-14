import fs from "fs";
import path from "path";

export default function handler(req,res){

res.setHeader("Access-Control-Allow-Origin","*");

const filePath=path.join(
process.cwd(),
"data",
"payment-data.json"
);

const database=JSON.parse(
fs.readFileSync(filePath,"utf8")
);

return res.status(200).json({

success:true,

platforms:Object.keys(database)

});

}
