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
content,
newPlatform,
action
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

const paymentFilePath="data/payment-data.json";
const platformFilePath="data/platforms.json";

/* ==========================
LOAD payment-data.json
========================== */

const paymentFile=await fetch(
`https://api.github.com/repos/${owner}/${repo}/contents/${paymentFilePath}`,
{
headers:{
Authorization:`token ${token}`
}
}
);

const paymentData=await paymentFile.json();

const database=JSON.parse(
Buffer
.from(paymentData.content,"base64")
.toString("utf8")
);

/* ==========================
LOAD platforms.json
========================== */

const platformFile=await fetch(
`https://api.github.com/repos/${owner}/${repo}/contents/${platformFilePath}`,
{
headers:{
Authorization:`token ${token}`
}
}
);

const platformData=await platformFile.json();

const platforms=JSON.parse(
Buffer
.from(platformData.content,"base64")
.toString("utf8")
);

/* ==========================
ACTIONS
========================== */

if(action==="add-platform"){

if(!database[newPlatform]){
database[newPlatform]={};
}

if(!platforms[newPlatform]){
platforms[newPlatform]={
logo:"IMAGE_URL"
};
}

}else if(action==="delete-platform"){

if(!database[platform]){
return res.status(404).json({
success:false,
message:"Platform not found."
});
}

if(Object.keys(database[platform]).length){
return res.status(400).json({
success:false,
message:"Delete all countries under this platform first."
});
}

delete database[platform];
delete platforms[platform];

}else{

if(!database[platform]){
database[platform]={};
}

database[platform][country]={
method,
logo,
content
};

}

/* ==========================
SAVE payment-data.json
========================== */

const updatedPaymentContent=JSON.stringify(
database,
null,
2
);

await fetch(
`https://api.github.com/repos/${owner}/${repo}/contents/${paymentFilePath}`,
{
method:"PUT",
headers:{
Authorization:`token ${token}`,
"Content-Type":"application/json"
},
body:JSON.stringify({
message:"Update payment data",
content:Buffer
.from(updatedPaymentContent)
.toString("base64"),
sha:paymentData.sha
})
}
);

/* ==========================
SAVE platforms.json
========================== */

const updatedPlatformContent=JSON.stringify(
platforms,
null,
2
);

const updateResponse=await fetch(
`https://api.github.com/repos/${owner}/${repo}/contents/${platformFilePath}`,
{
method:"PUT",
headers:{
Authorization:`token ${token}`,
"Content-Type":"application/json"
},
body:JSON.stringify({
message:"Update platforms",
content:Buffer
.from(updatedPlatformContent)
.toString("base64"),
sha:platformData.sha
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
