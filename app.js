const API=(window.TOURNAMENT_CONFIG?.API_BASE_URL||"").replace(/\/$/,"");
let token=sessionStorage.getItem("access_token")||"";
const $=id=>document.getElementById(id);
async function api(path,opts={}){opts.headers={...(opts.headers||{}),"Content-Type":"application/json"};if(token)opts.headers.Authorization=`Bearer ${token}`;const r=await fetch(API+path,opts);const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||"Request failed");return d}
function showMsg(x){$("msg").textContent=x}
async function loadMe(){const u=await api("/me");$("auth").hidden=true;$("app").hidden=false;$("tickets").textContent=u.tickets;$("balance").textContent="UGX "+u.cash_balance.toLocaleString();$("refLink").textContent=location.href.split("?")[0]+"?ref="+u.referral_code;await loadTournaments()}
async function loadTournaments(){const d=await api("/tournaments");$("tlist").innerHTML=d.tournaments.map(t=>`<article class="t"><h3>${escapeHtml(t.name)}</h3><p>Seat: UGX ${t.seat_price.toLocaleString()} · Prize: UGX ${t.prize_amount.toLocaleString()} · Players: ${t.max_players}</p><button data-seat="${t.id}">Get seat</button></article>`).join("");document.querySelectorAll("[data-seat]").forEach(b=>b.onclick=()=>seat(b.dataset.seat))}
async function seat(id){try{const d=await api(`/tournaments/${id}/seat`,{method:"POST"});alert(`Payment reference: ${d.payment_reference}. Connect your payment checkout to complete it.`)}catch(e){alert(e.message)}}
$("register").onclick=async()=>{try{const d=await api("/auth/register",{method:"POST",body:JSON.stringify({phone:$("phone").value,password:$("password").value,referral:$("referral").value||new URLSearchParams(location.search).get("ref")})});$("userId").value=d.user_id;$("verify").hidden=false;showMsg("Verification code sent.")}catch(e){showMsg(e.message)}};
$("verifyBtn").onclick=async()=>{try{const d=await api("/auth/verify-phone",{method:"POST",body:JSON.stringify({user_id:$("userId").value,code:$("smsCode").value})});token=d.token;sessionStorage.setItem("access_token",token);await loadMe()}catch(e){showMsg(e.message)}};
$("login").onclick=async()=>{try{const d=await api("/auth/login",{method:"POST",body:JSON.stringify({phone:$("phone").value,password:$("password").value})});token=d.token;sessionStorage.setItem("access_token",token);await loadMe()}catch(e){showMsg(e.message)}};
$("logout").onclick=()=>{sessionStorage.removeItem("access_token");location.reload()};
$("withdraw").onclick=async()=>{try{const d=await api("/withdrawals",{method:"POST",body:JSON.stringify({amount:Number($("wdAmount").value),phone:$("wdPhone").value})});$("wdMsg").textContent="Payout request "+d.reference+" is pending."}catch(e){$("wdMsg").textContent=e.message}};
document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.hidden=true);$(b.dataset.tab).hidden=false});
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
if(token)loadMe().catch(()=>{sessionStorage.removeItem("access_token");token=""});
