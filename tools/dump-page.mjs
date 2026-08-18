import fs from 'node:fs';
const f = process.argv[2];
let s = fs.readFileSync(f, 'utf8');
const ENT = [[/&nbsp;/gi,' '],[/&amp;/gi,'&'],[/&lt;/gi,'<'],[/&gt;/gi,'>'],[/&quot;/gi,'"'],[/&#39;/g,"'"],[/&rsquo;/gi,'’'],[/&ldquo;/gi,'“'],[/&rdquo;/gi,'”'],[/&pound;/gi,'£'],[/&hellip;/gi,'…'],[/&mdash;/gi,'—'],[/&ndash;/gi,'–'],[/&bull;/gi,'•']];
const dec = x => ENT.reduce((a,[r,t])=>a.replace(r,t),x).replace(/&#(\d+);/g,(_,d)=>String.fromCharCode(+d));
s = s.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<!--[\s\S]*?-->/g,' ');
const links = [];
s = s.replace(/<a\s[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (m,h,t)=>{
  const label = dec(t.replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
  links.push({label, href: dec(h).trim()});
  return ` [[${links.length}:${label}]] `;
});
const text = dec(s.replace(/<(p|div|br|tr|h[1-6]|li)[^>]*>/gi,'\n').replace(/<[^>]+>/g,' '))
  .split('\n').map(l=>l.replace(/\s+/g,' ').trim()).filter(l=>l.length>1).join('\n');
console.log('===== TEXT =====');
console.log(text.slice(0, Number(process.argv[3] ?? 9000)));
console.log('\n===== LINKS =====');
links.forEach((l,i)=>console.log(`${i+1}. ${l.label} -> ${l.href}`));
