/* stack.js — filter tabs + animated skill bars */
function filterStack(cat,el){
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  el.classList.add("active");
  document.querySelectorAll(".tech-card").forEach(c=>{
    c.style.display=(cat==="all"||c.dataset.cat===cat)?"flex":"none";
  });
}
(function(){
  const obs=new IntersectionObserver(es=>{
    es.forEach(e=>{
      if(e.isIntersecting){
        e.target.querySelectorAll(".tech-level-bar").forEach(b=>{
          const w=b.dataset.w+"%";b.style.width="0%";
          setTimeout(()=>{b.style.width=w;},150);
        });
        obs.unobserve(e.target);
      }
    });
  },{threshold:.2});
  const g=document.getElementById("techGrid");
  if(g)obs.observe(g);
  // card hover color from data-color attr
  document.querySelectorAll(".tech-card[data-color]").forEach(c=>{
    c.addEventListener("mouseenter",()=>c.style.borderColor=c.dataset.color);
    c.addEventListener("mouseleave",()=>c.style.borderColor="");
  });
})();
