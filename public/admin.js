const loginPage=document.getElementById("dmAdminLogin");

const dashboard=document.getElementById("dmDashboard");

const password=document.getElementById("dmPassword");

const loginBtn=document.getElementById("dmLoginBtn");

const status=document.getElementById("dmLoginStatus");

loginBtn.onclick=async()=>{

const value=password.value.trim();

if(!value){

status.textContent="Enter your password.";

return;

}

loginBtn.disabled=true;

loginBtn.textContent="Verifying...";

status.textContent="";

try{

const response=await fetch("/api/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
password:value
})

});

const result=await response.json();

if(result.success){

loginPage.style.display="none";

dashboard.style.display="block";

dashboard.innerHTML=`

<div class="dmDashboard">

<div class="dmDashboardCard">

<div class="dmDashboardHeader">

<div class="dmDashboardIcon">

🔐

</div>

<div>

<h1>Derah Admin</h1>

<p>Payment Management System</p>

</div>

</div>

<div class="dmSection">

<h3>Payment Details</h3>

<label>Platform</label>

<select id="platform">

</select>

<label>Country</label>

<select id="country">

<option>Benin</option>
<option>Ghana</option>
<option>Nigeria</option>
<option>Cameroon</option>
<option>Kenya</option>
<option>Uganda</option>
<option>Rwanda</option>
<option>Tanzania</option>

</select>

<label>Payment Method</label>

<input
id="method"
placeholder="MTN Mobile Money">

<label>Logo URL</label>

<input
id="logo"
placeholder="https://...">

<label>Payment Details</label>

<textarea
id="content"
placeholder="Payment instructions..."></textarea>

<button id="saveBtn">

Save Changes

</button>
<hr style="margin:30px 0;border:none;border-top:1px solid rgba(255,255,255,.08);">

<label>New Platform</label>

<input
id="newPlatform"
placeholder="e.g. NovaPay">

<button id="addPlatformBtn">

Add Platform

</button>

<button
id="deletePlatformBtn"
style="
margin-top:12px;
background:#D63A3A;
color:#fff;
">

Delete Selected Platform

</button>

<div id="platformStatus"></div>
<div id="saveStatus"></div>

</div>

</div>

</div>

`;

const platformSelect=document.getElementById("platform");
  async function loadPlatforms(){

const response=await fetch("/api/platforms");

const result=await response.json();

platformSelect.innerHTML="";

result.platforms.forEach(platform=>{

const option=document.createElement("option");

option.value=platform.name;

option.textContent=platform.name;

platformSelect.appendChild(option);

});

loadPayment();

}

loadPlatforms();

const countrySelect=document.getElementById("country");

const methodInput=document.getElementById("method");

const logoInput=document.getElementById("logo");

const contentInput=document.getElementById("content");

async function loadPayment(){

const response=await fetch(

`/api/payment?platform=${encodeURIComponent(platformSelect.value)}&country=${encodeURIComponent(countrySelect.value)}`

);

const result=await response.json();

if(!result.success){

methodInput.value="";

logoInput.value="";

contentInput.value="";

return;

}

methodInput.value=result.method||"";

logoInput.value=result.logo||"";

contentInput.value=result.content||"";

}

platformSelect.onchange=loadPayment;

countrySelect.onchange=loadPayment;

const saveBtn=document.getElementById("saveBtn");
  const addPlatformBtn=document.getElementById("addPlatformBtn");

const newPlatform=document.getElementById("newPlatform");

const platformStatus=document.getElementById("platformStatus");
const deletePlatformBtn=document.getElementById("deletePlatformBtn");
const saveStatus=document.getElementById("saveStatus");

saveBtn.onclick=async()=>{

saveBtn.disabled=true;

saveBtn.textContent="Saving...";

saveStatus.textContent="";

const response=await fetch("/api/update",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

password:password.value,

platform:platformSelect.value,

country:countrySelect.value,

method:methodInput.value,

logo:logoInput.value,

content:contentInput.value

})

});

const result=await response.json();

if(result.success){

saveStatus.textContent="Saved Successfully ✅";

}else{

saveStatus.textContent=result.message||"Failed";

}

saveBtn.disabled=false;

saveBtn.textContent="Save Changes";

};
addPlatformBtn.onclick=async()=>{

const name=newPlatform.value.trim();

if(!name){

platformStatus.textContent="Enter a platform name.";

return;

}

addPlatformBtn.disabled=true;

addPlatformBtn.textContent="Adding...";

platformStatus.textContent="";

const response=await fetch("/api/update",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

password:password.value,

action:"add-platform",

newPlatform:name,

logo:logoInput.value

})

});

const result=await response.json();

if(result.success){

platformStatus.textContent="Platform Added ✅";

newPlatform.value="";

await loadPlatforms();

platformSelect.value=name;

loadPayment();

}else{

platformStatus.textContent=result.message||"Failed";

}

addPlatformBtn.disabled=false;

addPlatformBtn.textContent="Add Platform";

}; 
deletePlatformBtn.onclick=async()=>{

const name=platformSelect.value;

if(!confirm(`Delete "${name}"?`)){
return;
}

deletePlatformBtn.disabled=true;

deletePlatformBtn.textContent="Deleting...";

platformStatus.textContent="";

const response=await fetch("/api/update",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

password:password.value,

action:"delete-platform",

platform:name

})

});

const result=await response.json();

if(result.success){

platformStatus.textContent="Platform Deleted ✅";

await loadPlatforms();

loadPayment();

}else{

platformStatus.textContent=result.message||"Failed";

}

deletePlatformBtn.disabled=false;

deletePlatformBtn.textContent="Delete Selected Platform";

};  
}else{

status.textContent="Incorrect password.";

}

}catch{

status.textContent="Unable to connect.";

}

loginBtn.disabled=false;

loginBtn.textContent="Login";

};
