
export default function handler(req,res){

res.setHeader("Access-Control-Allow-Origin","*");

res.setHeader("Access-Control-Allow-Methods","POST,OPTIONS");

res.setHeader("Access-Control-Allow-Headers","Content-Type");

if(req.method==="OPTIONS"){

return res.status(200).end();

}

if(req.method!=="POST"){

return res.status(405).json({

success:false,

message:"Method Not Allowed"

});

}

const{

password,

platform,

country,

method,

logo,

content

}=req.body;

if(password!==process.env.DERAH_ADMIN_PASSWORD){

return res.status(401).json({

success:false,

message:"Unauthorized"

});

}
const filePath=path.join(
process.cwd(),
"data",
"payment-data.json"
);

const raw=fs.readFileSync(filePath,"utf8");

const database=JSON.parse(raw);
  if(!database[platform]){

database[platform]={};

}

database[platform][country]={

method,

logo,

content

};
}
