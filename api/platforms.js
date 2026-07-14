import fs from "fs";
import path from "path";

export default function handler(req,res){

res.setHeader("Access-Control-Allow-Origin","*");

const filePath=path.join(
process.cwd(),
"data",
"platforms.json"
);

const database=JSON.parse(
fs.readFileSync(filePath,"utf8")
);

const platforms=Object.entries(database).map(
([name,data])=>({

name,

logo:data.logo

})
);

return res.status(200).json({

success:true,

platforms

});

}
