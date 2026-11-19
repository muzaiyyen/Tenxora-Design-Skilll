const { chromium } = require('playwright'); const fs=require('fs');
const S=process.env.S;
const pages=[['01-why-tenxora','why-tenxora'],['02-odoo-services','odoo-services'],['03-implementation','odoo-services/implementation'],['04-ai-assisted-implementation','odoo-services/ai-assisted-implementation'],['05-consulting','odoo-services/consulting'],['06-integration','odoo-services/integration'],['07-migration','odoo-services/migration'],['08-customization','odoo-services/customization'],['09-implementation-cost','odoo-services/implementation-cost'],['10-contactus','contactus'],['11-book-a-call','book-a-call'],['12-privacy','privacy'],['13-cookie-policy','cookie-policy'],['14-partners','partners'],['15-pricing','partners/pricing'],['16-terms','partners/terms'],['17-odoo-implementation-team-time','2026/11/10/odoo-implementation-team-time']];
(async()=>{const b=await chromium.launch();const rows=[];
for(const [ref,path] of pages){const R=fs.readFileSync(`${S}/ref17/pages/${ref}/index.html`,'utf8');
 const refTitle=(R.match(/<title>([^<]*)<\/title>/)||[])[1];
 for(const w of [1440,390]){const p=await b.newPage({viewport:{width:w,height:900}});const errs=[];
  p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,120))});p.on('pageerror',e=>errs.push(e.message.slice(0,120)));
  await p.goto(`http://localhost:3411/${path}/`,{waitUntil:'networkidle'});await p.waitForTimeout(2000);
  const r=await p.evaluate(()=>({title:document.title,titles:document.querySelectorAll('title').length,desc:document.querySelectorAll('meta[name=description]').length,canon:document.querySelectorAll('link[rel=canonical]').length,h1:document.querySelectorAll('h1').length,slots:[...document.querySelectorAll('[data-tx-slot]')].map(s=>s.dataset.txSlot+':'+(s.querySelector('form,iframe,.calendly-inline-widget')?'filled':'EMPTY')).join(' '),overflow:document.documentElement.scrollWidth>innerWidth}));
  // keyboard: tab 12 times, every focused element must show a visible focus indicator
  let noRing=0;for(let i=0;i<12;i++){await p.keyboard.press('Tab');const ok=await p.evaluate(()=>{const a=document.activeElement;if(!a||a===document.body)return true;const c=getComputedStyle(a);return c.outlineStyle!=='none'&&c.outlineWidth!=='0px'||c.boxShadow!=='none'});if(!ok)noRing++;}
  rows.push({path,w,titleOK:r.title.replace(/&amp;/g,'&')===(refTitle||'').replace(/&amp;/g,'&'),...r,noRing,errs:errs.length});await p.close();}}
console.log(JSON.stringify(rows));await b.close();})();
