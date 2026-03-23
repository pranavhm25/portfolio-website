/* projects.js — 3D tilt + live GitHub repos */
(function(){
  document.querySelectorAll(".project-card").forEach(card=>{
    card.addEventListener("mousemove",e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(1000px) rotateY(${x*8}deg) rotateX(${-y*5}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave",()=>{
      card.style.transform="perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
    });
  });
})();

async function loadGitHubProjects(){
  const container=document.getElementById("github-projects");
  if(!container)return;
  container.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--muted)">⏳ Fetching live repos...</div>`;
  try{
    const res=await fetch(`${API}/github/projects`);
    const data=await res.json();
    if(!data.success||!data.repos?.length){container.innerHTML=`<p style="color:var(--muted);text-align:center;grid-column:1/-1">No repos found.</p>`;return;}
    container.innerHTML=data.repos.map(r=>{
      const langs=Object.keys(r.languages).slice(0,3).join(" · ")||r.language;
      const upd=r.updated_at?new Date(r.updated_at).toLocaleDateString("en-IN",{month:"short",year:"numeric"}):"";
      return`<div style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px;display:flex;flex-direction:column;gap:14px;transition:transform .25s,border-color .25s;cursor:default" onmouseenter="this.style.transform='translateY(-5px)';this.style.borderColor='rgba(255,111,216,.3)'" onmouseleave="this.style.transform='';this.style.borderColor=''">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
          <div style="font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:#fff">🗂 ${r.name}</div>
          <div style="display:flex;gap:10px;font-size:12px;color:var(--muted)"><span>⭐ ${r.stars}</span><span>🍴 ${r.forks}</span></div>
        </div>
        <p style="font-size:13px;color:var(--muted);line-height:1.65;flex:1">${r.description}</p>
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-top:auto">
          <span style="font-size:11px;color:var(--yellow);background:rgba(250,204,21,.08);border:1px solid rgba(250,204,21,.2);padding:3px 12px;border-radius:100px">${langs}</span>
          <div style="display:flex;gap:8px;align-items:center">
            ${upd?`<span style="font-size:11px;color:var(--muted)">${upd}</span>`:""}
            ${r.homepage?`<a href="${r.homepage}" target="_blank" style="font-size:12px;color:var(--pink);text-decoration:none;padding:5px 14px;border:1px solid rgba(255,111,216,.3);border-radius:100px">Live ↗</a>`:""}
            <a href="${r.url}" target="_blank" style="font-size:12px;color:var(--muted);text-decoration:none;padding:5px 14px;border:1px solid var(--border);border-radius:100px">GitHub ↗</a>
          </div>
        </div>
      </div>`;
    }).join("");
  }catch(err){
    container.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:32px;color:var(--muted)">⚠️ Could not load repos. Is the backend running?<br><small>${err.message}</small></div>`;
  }
}
document.addEventListener("DOMContentLoaded",loadGitHubProjects);
