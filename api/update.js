export default async function handler(req,res){

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

const owner=process.env.GITHUB_OWNER;
const repo=process.env.GITHUB_REPO;
const token=process.env.GITHUB_TOKEN;

const filePath="data/payment-data.json";

const currentFile=await fetch(
`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
{
headers:{
Authorization:`token ${token}`
}
}
);

const currentData=await currentFile.json();

const database=JSON.parse(
Buffer
.from(currentData.content,"base64")
.toString("utf8")
);

if(!database[platform]){
database[platform]={};
}

database[platform][country]={
method,
logo,
content
};

const updatedContent=JSON.stringify(
database,
null,
2
);

const updateResponse=await fetch(
`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
{
method:"PUT",
headers:{
Authorization:`token ${token}`,
"Content-Type":"application/json"
},
body:JSON.stringify({
message:`Update ${platform} ${country}`,
content:Buffer
.from(updatedContent)
.toString("base64"),
sha:currentData.sha
})
}
);

const result=await updateResponse.json();

if(result.commit){

return res.status(200).json({
success:true,
message:"Saved Successfully"
});

}

return res.status(500).json({
success:false,
message:"GitHub Update Failed",
result
});

}
