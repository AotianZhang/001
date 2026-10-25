import {Shape,numberValue,formatNumber,serializeElement} from './Shape.ts';import type {Attrs} from './Shape.ts';
export class EllipseShape extends Shape {
  constructor(id:string,private cx:number,private cy:number,private rx:number,private ry:number,styles:Attrs={}){super('ellipse',id,styles);if(rx<0||ry<0)throw new Error('radii must be non-negative');}
  isContainer():boolean{return false;} children():Shape[]{return [];} addChild():void{throw new Error('not a container');} removeChild():number{throw new Error('not a container');}
  clone():EllipseShape{return new EllipseShape(this.id,this.cx,this.cy,this.rx,this.ry,this.styles);}
  move(dx:number,dy:number):void{this.cx+=dx;this.cy+=dy;} scale(f:number):void{this.cx*=f;this.cy*=f;this.rx*=f;this.ry*=f;}
  protected geometryAttributes():Attrs{return {cx:formatNumber(this.cx),cy:formatNumber(this.cy),rx:formatNumber(this.rx),ry:formatNumber(this.ry)};}
  protected setGeometryAttribute(n:string,v:string|undefined):string|undefined{if(!['cx','cy','rx','ry'].includes(n))throw new Error(`unknown attribute: ${n}`);const old=this.geometryAttributes()[n];const next=numberValue(n,v);if((n==='rx'||n==='ry')&&next<0)throw new Error(`${n} must be non-negative`);if(n==='cx')this.cx=next;if(n==='cy')this.cy=next;if(n==='rx')this.rx=next;if(n==='ry')this.ry=next;return old;}
  summary():string{return `ellipse#${this.id}  cx=${this.cx} cy=${this.cy} rx=${this.rx} ry=${this.ry}${this.styles.fill?` fill=${this.styles.fill}`:''}`;}
  toSvg(indent=''):string{return serializeElement('ellipse',this.id,this.getAttributes(),indent);}
}
