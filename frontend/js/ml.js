/* ml.js — animated ML progress bars */
(function(){
  const obs=new IntersectionObserver(es=>{
    es.forEach(e=>{
      if(e.isIntersecting){
        e.target.querySelectorAll(".ml-bar-fill").forEach(b=>{
          const w=b.dataset.w+"%";b.style.width="0%";
          setTimeout(()=>{b.style.width=w;},150);
        });
        obs.unobserve(e.target);
      }
    });
  },{threshold:.2});
  const s=document.getElementById("ml-journey");
  if(s)obs.observe(s);
})();
