import {DocumentModel} from '../domain/Document.ts';
import {Shape} from '../domain/Shape.ts';import type {Attrs} from '../domain/Shape.ts';
import {GroupShape} from '../domain/GroupShape.ts';
import {RectShape} from '../domain/RectShape.ts';
import {CircleShape} from '../domain/CircleShape.ts';
import {EllipseShape} from '../domain/EllipseShape.ts';
import {LineShape} from '../domain/LineShape.ts';
import {TextShape} from '../domain/TextShape.ts';

export class SvgCodec {
  serialize(doc:DocumentModel):string{return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${doc.width}" height="${doc.height}" viewBox="0 0 ${doc.width} ${doc.height}">\n${doc.root.children().map(s=>s.toSvg('  ')).join('\n')}\n</svg>\n`;}
  parse(xml:string,path?:string):{document:DocumentModel;warnings:string[]}{
    const root=/<svg\b([^>]*)>/i.exec(xml);if(!root)throw new Error('invalid SVG: missing <svg> root');const rootAttrs=parseAttrs(root[1]);const width=positive(rootAttrs.width??'800','width'),height=positive(rootAttrs.height??'600','height');const doc=new DocumentModel(width,height);doc.path=path;const warnings:string[]=[];const counters=new Map<string,number>();const stack:GroupShape[]=[doc.root];const tokens=xml.replace(/<!--[\s\S]*?-->/g,'').match(/<[^>]+>|[^<]+/g)??[];let seenRoot=false;
    for(const token of tokens){if(token.startsWith('<?')||token.startsWith('<!'))continue;if(/^<svg\b/i.test(token)){seenRoot=true;continue;}if(/^<\/svg/i.test(token))continue;if(token.startsWith('</')){const tag=token.slice(2).match(/^([\w:-]+)/)?.[1]?.toLowerCase();if(tag==='g'){if(stack.length===1)throw new Error('invalid SVG: unbalanced group');stack.pop();}continue;}
      if(token.startsWith('<')){const selfClosing=/\/\s*>$/.test(token);const m=/^<([\w:-]+)\b([\s\S]*?)\/?\s*>$/.exec(token);if(!m)continue;const tag=m[1].toLowerCase().split(':').pop()!;if(tag==='svg')continue;if(!['g','rect','circle','ellipse','line','text'].includes(tag))continue;const raw=parseAttrs(m[2]);let id=raw.id;if(!id){let n=(counters.get(tag)??0)+1;id=`${tag}${n}`;while(doc.find(id)){n++;id=`${tag}${n}`;}counters.set(tag,n);warnings.push(`warning: assigned id ${id} to unnamed <${tag}>`);}const styles:Attrs={};for(const [k,v] of Object.entries(raw))if(!['id','x','y','width','height','cx','cy','r','rx','ry','x1','x2','y1','y2','data-kind'].includes(k))styles[k]=v;let shape:Shape;
        if(tag==='g')shape=new GroupShape(id,styles,raw['data-kind']==='box'?'box':'g');
        else if(tag==='rect')shape=new RectShape(id,num(raw.x,'x'),num(raw.y,'y'),num(raw.width,'width'),num(raw.height,'height'),styles);
        else if(tag==='circle')shape=new CircleShape(id,num(raw.cx,'cx'),num(raw.cy,'cy'),num(raw.r,'r'),styles);
        else if(tag==='ellipse')shape=new EllipseShape(id,num(raw.cx,'cx'),num(raw.cy,'cy'),num(raw.rx,'rx'),num(raw.ry,'ry'),styles);
        else if(tag==='line')shape=new LineShape(id,num(raw.x1,'x1'),num(raw.y1,'y1'),num(raw.x2,'x2'),num(raw.y2,'y2'),styles);
        else shape=new TextShape(id,num(raw.x,'x'),num(raw.y,'y'),'',styles);
        const parent=stack[stack.length-1];doc.add(shape,parent);if(tag==='g'&&!selfClosing)stack.push(shape as GroupShape);if(tag==='text'){if(selfClosing)(shape as TextShape).setAttribute('text','');else (stack[stack.length-1] as any).__pendingText=shape;}
      }else{const parent=stack[stack.length-1];const pending=(parent as any).__pendingText as TextShape|undefined;if(pending){pending.setAttribute('text',decode(token));delete (parent as any).__pendingText;}}
    }
    if(stack.length!==1)throw new Error('invalid SVG: unclosed <g>');if(!seenRoot)throw new Error('invalid SVG: missing root');return {document:doc,warnings};
  }
}
function parseAttrs(src:string):Attrs{const out:Attrs={};const re=/([\w:-]+)\s*=\s*(["'])(.*?)\2/g;let m:RegExpExecArray|null;while((m=re.exec(src)))out[m[1].toLowerCase()]=decode(m[3]);return out;}
function decode(v:string):string{return v.replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');}
function num(v:string|undefined,name:string):number{if(v===undefined||v.trim()==='')throw new Error(`invalid SVG: missing ${name}`);const n=Number(v);if(!Number.isFinite(n))throw new Error(`invalid SVG: invalid ${name}`);return n;}
function positive(v:string,name:string):number{const n=num(v,name);if(n<=0)throw new Error(`invalid SVG: ${name} must be positive`);return n;}
