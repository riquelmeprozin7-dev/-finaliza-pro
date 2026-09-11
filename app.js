const demo={
home:"Coritiba",away:"Mirassol",
homeShots:[14,13,16,12,15], awayShots:[12,14,11,13,12],
homeConceded:[10,11,9,13,12], awayConceded:[11,12,14,10,13],
homeGoals:[2,1,2,0,1], awayGoals:[1,2,1,1,0],
homeAgainstGoals:[1,0,1,1,2], awayAgainstGoals:[1,1,2,0,1],
h2hShots:[[13,12],[15,11],[12,13],[14,12],[11,14]]
};

function avg(a){return a.reduce((x,y)=>x+y,0)/a.length}
function overPct(a,line){return Math.round(a.filter(x=>x>line).length/a.length*100)}
function pct(v){return Math.max(0,Math.min(100,Math.round(v)))}
function confidence(v){return v>=75?"Alta":v>=60?"Média":"Baixa"}

function analyze(){
  const home=document.getElementById("home").value.trim()||"Time Casa";
  const away=document.getElementById("away").value.trim()||"Time Fora";
  render({...demo,home,away});
}
function loadDemo(){document.getElementById("home").value=demo.home;document.getElementById("away").value=demo.away;render(demo)}

function render(d){
  const hS=avg(d.homeShots), aS=avg(d.awayShots), hC=avg(d.homeConceded), aC=avg(d.awayConceded);
  const hG=avg(d.homeGoals), aG=avg(d.awayGoals), hGA=avg(d.homeAgainstGoals), aGA=avg(d.awayAgainstGoals);
  const hOver=overPct(d.homeGoals.map((x,i)=>x+d.homeAgainstGoals[i]),1.5);
  const aOver=overPct(d.awayGoals.map((x,i)=>x+d.awayAgainstGoals[i]),1.5);
  const hLine=13.5,aLine=11.5;
  const hLinePct=overPct(d.homeShots,hLine), aLinePct=overPct(d.awayShots,aLine);
  const shotScore=pct((hLinePct+aLinePct)/2*0.7 + ((hS+aS)/(hC+aC))*30);
  const goalScore=pct((hOver+aOver)/2);
  const pro=pct(shotScore*0.65+goalScore*0.35);
  const level=confidence(pro);
  const cls=level==="Alta"?"high":level==="Média"?"medium":"low";
  const totalAvg=hG+hGA+aG+aGA;

  document.getElementById("result").classList.remove("hidden");
  document.getElementById("result").innerHTML=`
  <div class="card">
    <h2>🔥 Resultado PRO</h2>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
      <div><b style="font-size:22px">${d.home} x ${d.away}</b><div style="color:#91a2b1;margin-top:5px">Base demonstrativa — substitua pelos dados reais da partida.</div></div>
      <span class="badge ${cls}">${level} • ${pro}%</span>
    </div>
    <div class="bar"><div class="fill" style="width:${pro}%"></div></div>
    <div class="score">
      <div class="metric"><small>🎯 Finalizações ${d.home}</small><strong>${hS.toFixed(1)}</strong><div>+${hLinePct}% acima de ${hLine}</div></div>
      <div class="metric"><small>🎯 Finalizações ${d.away}</small><strong>${aS.toFixed(1)}</strong><div>+${aLinePct}% acima de ${aLine}</div></div>
      <div class="metric"><small>⚽ Média total de gols</small><strong>${totalAvg.toFixed(1)}</strong><div>Over 1.5: ${Math.round((hOver+aOver)/2)}%</div></div>
    </div>
  </div>
  <div class="twocol">
    <div class="card"><h2>📊 Últimos 5 — Finalizações</h2>
      <table class="table"><tr><th></th><th>Próprias</th><th>Sofridas</th></tr>
      ${d.homeShots.map((x,i)=>`<tr><td>${i+1}º</td><td>${x}</td><td>${d.homeConceded[i]}</td></tr>`).join("")}
      <tr><th>Média</th><th>${hS.toFixed(1)}</th><th>${hC.toFixed(1)}</th></tr></table>
    </div>
    <div class="card"><h2>📊 Últimos 5 — Visitante</h2>
      <table class="table"><tr><th></th><th>Próprias</th><th>Sofridas</th></tr>
      ${d.awayShots.map((x,i)=>`<tr><td>${i+1}º</td><td>${x}</td><td>${d.awayConceded[i]}</td></tr>`).join("")}
      <tr><th>Média</th><th>${aS.toFixed(1)}</th><th>${aC.toFixed(1)}</th></tr></table>
    </div>
  </div>
  <div class="twocol">
    <div class="card"><h2>⚽ Gols</h2>
      <table class="table"><tr><th></th><th>Marcados</th><th>Sofridos</th><th>Over 1.5</th></tr>
      <tr><td>${d.home}</td><td>${hG.toFixed(1)}</td><td>${hGA.toFixed(1)}</td><td>${hOver}%</td></tr>
      <tr><td>${d.away}</td><td>${aG.toFixed(1)}</td><td>${aGA.toFixed(1)}</td><td>${aOver}%</td></tr></table>
    </div>
    <div class="card"><h2>🎯 Linhas sugeridas</h2>
      <p><b>${d.home} +${hLine} finalizações</b> — ${hLinePct}% nos últimos 5</p>
      <p><b>${d.away} +${aLine} finalizações</b> — ${aLinePct}% nos últimos 5</p>
      <p><b>Over 1.5 gols</b> — ${Math.round((hOver+aOver)/2)}% combinado</p>
      <p><b>Score PRO</b> — ${pro}% (${level})</p>
    </div>
  </div>`;
}

document.getElementById("themeBtn").onclick=()=>document.body.classList.toggle("light");
loadDemo();
