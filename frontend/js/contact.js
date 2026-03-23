/* contact.js — form submission to Flask API */
const spinStyle=document.createElement("style");
spinStyle.textContent="@keyframes spin{to{transform:rotate(360deg)}}";
document.head.appendChild(spinStyle);

async function handleSubmit(){
  const name=document.getElementById("fname")?.value.trim();
  const email=document.getElementById("femail")?.value.trim();
  const subject=document.getElementById("fsubject")?.value||"Portfolio Enquiry";
  const message=document.getElementById("fmessage")?.value.trim();
  const btn=document.querySelector(".submit-btn");
  if(!name||!email||!message){
    btn.style.background="linear-gradient(135deg,#f97316,#e11d48)";
    btn.innerHTML="⚠ Please fill all fields";
    setTimeout(()=>{btn.style.background="linear-gradient(135deg,var(--pink),var(--yellow))";btn.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg> Send Message';},2000);
    return;
  }
  btn.innerHTML=`<span style="display:inline-block;width:14px;height:14px;border:2px solid rgba(0,0,0,.3);border-top-color:#000;border-radius:50%;animation:spin .6s linear infinite"></span> Sending...`;
  btn.disabled=true;
  try{
    const res=await fetch(`${API}/contact`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,email,subject,message})});
    const data=await res.json();
    if(data.success){
      document.getElementById("formContent").style.display="none";
      document.getElementById("successMsg").style.display="flex";
    }else throw new Error(data.error||"Unknown error");
  }catch(err){
    btn.style.background="linear-gradient(135deg,#f97316,#e11d48)";
    btn.innerHTML=`⚠ ${err.message}`;btn.disabled=false;
    setTimeout(()=>{btn.style.background="linear-gradient(135deg,var(--pink),var(--yellow))";btn.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg> Send Message';btn.disabled=false;},3000);
  }
}
function resetForm(){
  ["fname","femail","fmessage"].forEach(id=>{document.getElementById(id).value="";});
  document.getElementById("fsubject").selectedIndex=0;
  document.getElementById("formContent").style.display="flex";
  document.getElementById("successMsg").style.display="none";
}
