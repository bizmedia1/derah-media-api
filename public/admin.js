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

<div class="dmDashboard">

<h1>Derah Admin</h1>

<p>Payment Management</p>

<label>Platform</label>

<select id="platform">

<option>Nextel</option>
<option>Velora</option>
<option>Incossify</option>
<option>Vireon</option>
<option>Optinex</option>
<option>Aurion</option>
<option>Glamour</option>

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

<div id="saveStatus"></div>

</div>

`;

const platformSelect=document.getElementById("platform");

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

loadPayment();

}else{

status.textContent="Incorrect password.";

}

}catch{

status.textContent="Unable to connect.";

}

loginBtn.disabled=false;

loginBtn.textContent="Login";

};
