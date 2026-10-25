import {Shape,numberValue,formatNumber,escapeXml} from './Shape.ts';import type {Attrs} from './Shape.ts';
export class TextShape extends Shape {
  constructor(id:string,private x:number,private y:number,private content:string,styles:Attrs={}){super('text',id,styles);}
  get text():string{return this.content;}
  isContainer():boolean{return false;} children():Shape[]{return [];} addChild():void{throw new Error('not a container');} removeChild():number{throw new Error('not a container');}
  clone():TextShape{return new TextShape(this.id,this.x,this.y,this.content,this.styles);}
  move(dx:number,dy:number):void{this.x+=dx;this.y+=dy;} scale(f:number):void{this.x*=f;this.y*=f;}
  protected geometryAttributes():Attrs{return {x:formatNumber(this.x),y:formatNumber(this.y)};}
  getAttributes():Attrs{return {...this.geometryAttributes(),...this.styles,text:this.content};}
  setAttribute(n:string,v:string|undefined):string|undefined{if(n==='text'){const old=this.content;this.content=v??'';return old;}return super.setAttribute(n,v);}
  protected setGeometryAttribute(n:string,v:string|undefined):string|undefined{if(!['x','y'].includes(n))throw new Error(`unknown attribute: ${n}`);const old=this.geometryAttributes()[n];const next=numberValue(n,v);if(n==='x')this.x=next;else this.y=next;return old;}
  summary():string{return `text#${this.id}  (${this.x},${this.y}) "${this.content}"`;}
  toSvg(indent=''):string{const attrs={...this.geometryAttributes(),...this.styles};const rendered=Object.entries(attrs).map(([k,v])=>`${k}="${escapeXml(v)}"`).join(' ');return `${indent}<text id="${escapeXml(this.id)}"${rendered?` ${rendered}`:''}>${escapeXml(this.content)}</text>`;}
}
