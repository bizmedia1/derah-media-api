import fs from "fs";
import path from "path";

export default function handler(req,res){
res.setHeader("Access-Control-Allow-Origin","*");

res.setHeader("Access-Control-Allow-Methods","GET,OPTIONS");

res.setHeader("Access-Control-Allow-Headers","Content-Type");
  if(req.method==="OPTIONS"){

return res.status(200).end();

  }
const {platform,country}=req.query;

if(!platform||!country){

return res.status(400).json({

success:false,

message:"Platform and country are required."

});

}

const filePath=path.join(process.cwd(),"data","payment-data.json");

const raw=fs.readFileSync(filePath,"utf8");

const database=JSON.parse(raw);

const data=database?.[platform]?.[country];

if(!data){

return res.status(404).json({

success:false,

message:"Coming Soon"

});

}

return res.status(200).json({

success:true,

platform,

country,

...data

});

}
