import {Shape,escapeXml} from './Shape.ts';import type {Attrs} from './Shape.ts';
export class GroupShape extends Shape {
  private items: Shape[]=[];
  constructor(id:string,styles:Attrs={},public readonly kind='g'){super('g',id,styles);}
  isContainer():boolean{return true;} children():Shape[]{return [...this.items];}
  addChild(child:Shape,index=this.items.length):void{if(child.parent)child.parent.removeChild(child);this.items.splice(index,0,child);child.setParent(this);}
  removeChild(child:Shape):number{const i=this.items.indexOf(child);if(i<0)return -1;this.items.splice(i,1);child.setParent(null);return i;}
  clone():GroupShape{const g=new GroupShape(this.id,this.styles,this.kind);for(const c of this.items)g.addChild(c.clone());return g;}
  move(dx:number,dy:number):void{for(const c of this.items)c.move(dx,dy);} scale(f:number):void{for(const c of this.items)c.scale(f);}
  protected geometryAttributes():Attrs{return {};}
  protected setGeometryAttribute(n:string,v:string|undefined):string|undefined{throw new Error(`unknown attribute: ${n}`);}
  summary():string{return `g#${this.id}${this.kind!=='g'?` (${this.kind})`:''}`;}
  toSvg(indent=''):string{const attrs=Object.entries(this.styles).map(([k,v])=>`${k}="${escapeXml(v)}"`).join(' ');const head=`${indent}<g id="${escapeXml(this.id)}"${this.kind!=='g'?` data-kind="${escapeXml(this.kind)}"`:''}${attrs?` ${attrs}`:''}>`;return [head,...this.items.map(c=>c.toSvg(indent+'  ')),`${indent}</g>`].join('\n');}
}
