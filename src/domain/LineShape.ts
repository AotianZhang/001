import {Shape,numberValue,formatNumber,serializeElement} from './Shape.ts';import type {Attrs} from './Shape.ts';
export class LineShape extends Shape {
  constructor(id:string,private x1:number,private y1:number,private x2:number,private y2:number,styles:Attrs={}){super('line',id,styles);}
  isContainer():boolean{return false;} children():Shape[]{return [];} addChild():void{throw new Error('not a container');} removeChild():number{throw new Error('not a container');}
  clone():LineShape{return new LineShape(this.id,this.x1,this.y1,this.x2,this.y2,this.styles);}
  move(dx:number,dy:number):void{this.x1+=dx;this.x2+=dx;this.y1+=dy;this.y2+=dy;} scale(f:number):void{this.x1*=f;this.y1*=f;this.x2*=f;this.y2*=f;}
  protected geometryAttributes():Attrs{return {x1:formatNumber(this.x1),y1:formatNumber(this.y1),x2:formatNumber(this.x2),y2:formatNumber(this.y2)};}
  protected setGeometryAttribute(n:string,v:string|undefined):string|undefined{if(!['x1','y1','x2','y2'].includes(n))throw new Error(`unknown attribute: ${n}`);const old=this.geometryAttributes()[n];const next=numberValue(n,v);if(n==='x1')this.x1=next;if(n==='y1')this.y1=next;if(n==='x2')this.x2=next;if(n==='y2')this.y2=next;return old;}
  summary():string{return `line#${this.id}  (${this.x1},${this.y1}) -> (${this.x2},${this.y2})${this.styles.stroke?` stroke=${this.styles.stroke}`:''}`;}
  toSvg(indent=''):string{return serializeElement('line',this.id,this.getAttributes(),indent);}
}
