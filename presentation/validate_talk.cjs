// Buildless browser checks through Chrome's DevTools protocol. No npm dependencies.
const fs=require('fs'),path=require('path'),http=require('http'),net=require('net'),crypto=require('crypto'),{spawn}=require('child_process');
const root=process.cwd(),out=path.join(process.env.TEMP,'tn-talk-qa-20261115');fs.mkdirSync(out,{recursive:true});
const pause=ms=>new Promise(r=>setTimeout(r,ms));
class CDP{
  constructor(url){this.url=new URL(url);this.id=0;this.pending=new Map();this.events=[];this.buf=Buffer.alloc(0);}
  async connect(){await new Promise((resolve,reject)=>{this.socket=net.connect(+this.url.port,this.url.hostname,()=>{this.socket.write(`GET ${this.url.pathname} HTTP/1.1\r\nHost: ${this.url.host}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: ${crypto.randomBytes(16).toString('base64')}\r\nSec-WebSocket-Version: 13\r\n\r\n`);});let ready=false;this.socket.on('error',reject);this.socket.on('data',b=>{this.buf=Buffer.concat([this.buf,b]);if(!ready){const i=this.buf.indexOf('\r\n\r\n');if(i<0)return;this.buf=this.buf.subarray(i+4);ready=true;resolve();}this.parse();});});return this;}
  parse(){while(this.buf.length>=2){const opcode=this.buf[0]&15;let len=this.buf[1]&127,pos=2;if(len===126){if(this.buf.length<4)return;len=this.buf.readUInt16BE(2);pos=4;}else if(len===127){if(this.buf.length<10)return;len=Number(this.buf.readBigUInt64BE(2));pos=10;}if(this.buf.length<pos+len)return;const raw=this.buf.subarray(pos,pos+len);this.buf=this.buf.subarray(pos+len);if(opcode!==1)continue;const msg=JSON.parse(raw.toString());if(msg.id){const p=this.pending.get(msg.id);if(p){this.pending.delete(msg.id);msg.error?p.reject(Error(JSON.stringify(msg.error))):p.resolve(msg.result);}}else this.events.push(msg);}}
  send(method,params={}){const id=++this.id,payload=Buffer.from(JSON.stringify({id,method,params})),mask=crypto.randomBytes(4);let head;if(payload.length<126){head=Buffer.from([129,128|payload.length]);}else{head=Buffer.alloc(4);head[0]=129;head[1]=254;head.writeUInt16BE(payload.length,2);}const data=Buffer.from(payload);for(let i=0;i<data.length;i++)data[i]^=mask[i%4];this.socket.write(Buffer.concat([head,mask,data]));return new Promise((resolve,reject)=>{this.pending.set(id,{resolve,reject});setTimeout(()=>{if(this.pending.has(id)){this.pending.delete(id);reject(Error('CDP timeout: '+method));}},60000).unref();});}
  async eval(expression){const r=await this.send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true,userGesture:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
  async shot(name){const r=await this.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,name),Buffer.from(r.data,'base64'));}
}
async function main(){
  const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');let p=path.resolve(root,'.'+decodeURIComponent(url.pathname));if(!p.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{const b=fs.readFileSync(p);res.setHeader('Content-Type',({'html':'text/html','js':'text/javascript','png':'image/png','woff':'font/woff','json':'application/json'})[p.split('.').pop()]||'application/octet-stream');res.end(b);}catch{res.writeHead(404);res.end();}});
  await new Promise(r=>server.listen(8765,'127.0.0.1',r));
  const browser=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--remote-debugging-port=9223','--user-data-dir='+path.join(out,'profile'),'--no-first-run','--no-default-browser-check','--window-size=1280,720','about:blank'],{windowsHide:true,stdio:'ignore'});
  let c;
  try{
    let tabs;for(let i=0;i<40;i++){try{tabs=await(await fetch('http://127.0.0.1:9223/json')).json();break;}catch{await pause(250);}}
    if(!tabs)throw Error('Chrome did not start');
    c=await new CDP(tabs.find(t=>t.type==='page').webSocketDebuggerUrl).connect();
    await c.send('Page.enable');await c.send('Runtime.enable');await c.send('Log.enable');
    await c.send('Emulation.setDeviceMetricsOverride',{width:1280,height:720,deviceScaleFactor:1,mobile:false});
    await c.send('Page.navigate',{url:'http://127.0.0.1:8765/presentation/tn_talk.html'});
    for(let i=0;i<80;i++){if(await c.eval("typeof window.deckTo==='function' && !!document.querySelector('mjx-container')"))break;await pause(500);}
    const env=await c.eval("({browser:navigator.userAgent,plotly:window.Plotly?.version,mathjax:window.MathJax?.version,slides:document.querySelectorAll('.slide').length,mathErrors:[...document.querySelectorAll('mjx-merror')].map(e=>e.textContent)})");
    console.log(JSON.stringify(env));
    await c.eval('deckTo(1)');
    const simplexBefore=await c.eval("document.getElementById('simplex-label').textContent");
    await c.eval("(()=>{const s=document.getElementById('simplex-demo'),p=s.createSVGPoint();p.x=200;p.y=250;const q=p.matrixTransform(s.getScreenCTM());s.dispatchEvent(new MouseEvent('click',{clientX:q.x,clientY:q.y,bubbles:true}));})()");
    const simplexInteractive=await c.eval("document.getElementById('simplex-label').textContent!=="+JSON.stringify(simplexBefore));
    await c.eval("deckTo(7);document.getElementById('tree-trace').click()");
    const treeInteractive=await c.eval("document.getElementById('tree-route').style.display!=='none' && document.getElementById('tree-trace').getAttribute('aria-pressed')==='true'");
    await c.eval("document.getElementById('tree-trace').click()");
    const checks=[];
    for(let i=0;i<(process.env.TN_PRINT_ONLY?0:42);i++){
      await c.eval(`deckTo(${i})`);await pause(450);
      const result=await c.eval(`(()=>{const s=document.querySelector('.slide.active'),r=s.getBoundingClientRect();return {n:${i+1},title:s.dataset.title,number:document.getElementById('num').textContent,plots:[...s.querySelectorAll('.plot')].map(p=>({id:p.id,drawn:!!p.data,width:p.clientWidth,height:p.clientHeight})),overflow:[...s.querySelectorAll('h1,h2,p,li,table,.ctl,.readout,.plot,.box,img,svg.fig')].filter(e=>!e.closest('aside')&&!e.closest('.js-plotly-plot')).filter(e=>{const b=e.getBoundingClientRect();return b.bottom>r.bottom-26||b.right>r.right-20||b.left<r.left;}).map(e=>({tag:e.tagName,text:e.textContent.slice(0,80),bottom:e.getBoundingClientRect().bottom})),imageOK:[...s.querySelectorAll('img')].every(e=>e.complete&&e.naturalWidth>0)};})()`);
      checks.push(result);await c.shot('slide-'+String(i+1).padStart(2,'0')+'.png');
    }
    if(!process.env.TN_PRINT_ONLY)fs.writeFileSync(path.join(out,'slide-checks.json'),JSON.stringify(checks,null,2));
    console.log('Slide checks: '+JSON.stringify(checks.filter(c=>c.overflow.length||c.plots.some(p=>!p.drawn)||!c.imageOK)));
    await c.eval("deckTo(17);document.getElementById('l-sph').click();document.getElementById('l-lines').click();document.getElementById('l-points').click()");await pause(300);
    const toggles=await c.eval("['l-sph','l-lines','l-points'].map(id=>document.getElementById(id).getAttribute('aria-pressed'))");
    await c.eval("['l-sph','l-lines','l-points'].forEach(id=>document.getElementById(id).click());deckTo(22);[1,2,3,4].forEach(i=>document.getElementById('t-s'+i).click())");
    await c.eval("deckTo(31);document.getElementById('r-rm').click()");await pause(200);
    const metric=await c.eval("document.getElementById('r-rm').getAttribute('aria-pressed')");
    await c.eval("document.getElementById('r-ad').click();deckTo(15);let a=document.getElementById('dc-a1');a.value=15;a.dispatchEvent(new Event('input'));deckTo(37)");
    await c.send('Input.dispatchKeyEvent',{type:'keyDown',key:'n'});await c.send('Input.dispatchKeyEvent',{type:'keyUp',key:'n'});
    const notes=await c.eval("({visible:document.getElementById('ovl').classList.contains('on'),say:document.getElementById('ovl').textContent.includes('SAY:'),target:document.getElementById('ovl').textContent.includes('45 seconds')})");
    await c.send('Input.dispatchKeyEvent',{type:'keyDown',key:'n'});
    await c.send('Input.dispatchKeyEvent',{type:'keyDown',key:'s'});await pause(350);
    const popups=await(await fetch('http://127.0.0.1:9223/json')).json();
    await c.send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight'});
    const navigation=await c.eval("location.hash");
    let speakerSync=false;
    const popup=popups.find(t=>t.type==='page'&&t.id!==tabs.find(t=>t.type==='page').id);
    if(popup){const nc=await new CDP(popup.webSocketDebuggerUrl).connect();speakerSync=await nc.eval("document.getElementById('t')?.textContent.startsWith('39 / 42') && document.getElementById('n')?.textContent.includes('REMEMBER:')");nc.socket.destroy();}
    await c.send('Page.bringToFront');
    await c.send('Input.dispatchKeyEvent',{type:'keyDown',key:'f'});await pause(250);
    const fullscreen=await c.eval("!!document.fullscreenElement");if(fullscreen)await c.eval("document.exitFullscreen()");
    let sliderCount=0;
    for(let i=0;i<(process.env.TN_PRINT_ONLY?0:42);i++){
      await c.eval(`deckTo(${i})`);
      sliderCount+=await c.eval("(()=>{const inputs=[...document.querySelectorAll('.slide.active input[type=range]')];for(const e of inputs){const v=e.value;e.value=Math.min(+e.max,+v+(+e.step||1));e.dispatchEvent(new Event('input'));e.value=v;e.dispatchEvent(new Event('input'));}return inputs.length})()");
      await pause(120);
    }
    await c.send('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});await c.eval('deckTo(33)');await pause(300);await c.shot('lucas-1920.png');
    await c.send('Emulation.setDeviceMetricsOverride',{width:1280,height:720,deviceScaleFactor:1,mobile:false});
    await c.eval('window.print=()=>{window.printInvoked=true};true');
    await c.send('Input.dispatchKeyEvent',{type:'keyDown',key:'p'});
    for(let i=0;i<100;i++){if(await c.eval('!!window.deckPrintReady'))break;await pause(500);}
    const print=await c.eval("({ready:!!window.deckPrintReady,staticImages:document.querySelectorAll('img.static').length,slides:document.querySelectorAll('.slide').length,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).length})");
    const pdf=await c.send('Page.printToPDF',{printBackground:true,preferCSSPageSize:true});const pdfBuffer=Buffer.from(pdf.data,'base64');fs.writeFileSync(path.join(out,'tn_talk.pdf'),pdfBuffer);
    print.pdfPages=(pdfBuffer.toString('latin1').match(/\/Type \/Page\b/g)||[]).length;
    if(print.pdfPages!==42)throw Error('Expected 42 PDF pages, got '+print.pdfPages);
    const errors=c.events.filter(e=>e.method==='Runtime.exceptionThrown'||e.method==='Log.entryAdded'&&e.params.entry.level==='error');
    const report={env,simplexInteractive,treeInteractive,toggles,metric,notes,popupOpened:popups.length>1,speakerSync,navigation,fullscreen,sliderCount,print,errors};fs.writeFileSync(path.join(out,'browser-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));console.log('Artifacts: '+out);
  }finally{if(c){try{await c.send('Browser.close');}catch{}c.socket.destroy();}browser.kill();server.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
