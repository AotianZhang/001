import {Shape,numberValue,formatNumber,serializeElement} from './Shape.ts';import type {Attrs} from './Shape.ts';
export class CircleShape extends Shape {
  constructor(id:string,private cx:number,private cy:number,private r:number,styles:Attrs={}){super('circle',id,styles);if(r<0)throw new Error('radius must be non-negative');}
  isContainer():boolean{return false;} children():Shape[]{return [];} addChild():void{throw new Error('not a container');} removeChild():number{throw new Error('not a container');}
  clone():CircleShape{return new CircleShape(this.id,this.cx,this.cy,this.r,this.styles);}
  move(dx:number,dy:number):void{this.cx+=dx;this.cy+=dy;} scale(f:number):void{this.cx*=f;this.cy*=f;this.r*=f;}
  protected geometryAttributes():Attrs{return {cx:formatNumber(this.cx),cy:formatNumber(this.cy),r:formatNumber(this.r)};}
  protected setGeometryAttribute(n:string,v:string|undefined):string|undefined{if(!['cx','cy','r'].includes(n))throw new Error(`unknown attribute: ${n}`);const old=this.geometryAttributes()[n];const next=numberValue(n,v);if(n==='r'&&next<0)throw new Error('r must be non-negative');if(n==='cx')this.cx=next;if(n==='cy')this.cy=next;if(n==='r')this.r=next;return old;}
  summary():string{return `circle#${this.id}  cx=${this.cx} cy=${this.cy} r=${this.r}${this.styles.fill?` fill=${this.styles.fill}`:''}`;}
  toSvg(indent=''):string{return serializeElement('circle',this.id,this.getAttributes(),indent);}
}
