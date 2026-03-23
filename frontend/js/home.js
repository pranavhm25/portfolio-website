/* home.js — typewriter + resume download */
(function(){
  const phrases=["PYTHON DEVELOPER","FULL STACK DEVELOPER","PROBLEM SOLVER","TECH ENTHUSIAST","BUILDING USEFUL TOOLS"];
  const el=document.getElementById("tw");
  if(!el)return;
  let pi=0,ci=0,del=false;
  function type(){
    const w=phrases[pi];
    if(!del){el.textContent=w.slice(0,++ci);if(ci===w.length){del=true;setTimeout(type,1800);return;}setTimeout(type,55+Math.random()*30);}
    else{el.textContent=w.slice(0,--ci);if(ci===0){del=false;pi=(pi+1)%phrases.length;setTimeout(type,350);return;}setTimeout(type,30);}
  }
  type();
})();

function downloadResume(){window.open(`${API}/resume/download`,"_blank");}
