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

const response=await fetch("/api/update",{

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

<h1 style="text-align:center;margin-top:80px;font-size:34px;">

Welcome 👋

</h1>

<p style="text-align:center;margin-top:16px;color:#9FB3D8;">

Derah Admin Dashboard

</p>

`;

}else{

status.textContent="Incorrect password.";

}

}catch{

status.textContent="Unable to connect.";

}

loginBtn.disabled=false;

loginBtn.textContent="Login";

};
