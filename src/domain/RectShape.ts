import {Shape,numberValue,formatNumber,serializeElement} from './Shape.ts';import type {Attrs} from './Shape.ts';
export class RectShape extends Shape {
  constructor(id:string,private x:number,private y:number,private width:number,private height:number,styles:Attrs={}){super('rect',id,styles);if(width<0||height<0)throw new Error('rectangle dimensions must be non-negative');}
  isContainer():boolean{return false;} children():Shape[]{return [];} addChild():void{throw new Error('not a container');} removeChild():number{throw new Error('not a container');}
  clone():RectShape{return new RectShape(this.id,this.x,this.y,this.width,this.height,this.styles);}
  move(dx:number,dy:number):void{this.x+=dx;this.y+=dy;} scale(f:number):void{this.x*=f;this.y*=f;this.width*=f;this.height*=f;}
  protected geometryAttributes():Attrs{return {x:formatNumber(this.x),y:formatNumber(this.y),width:formatNumber(this.width),height:formatNumber(this.height)};}
  protected setGeometryAttribute(n:string,v:string|undefined):string|undefined{if(!['x','y','width','height'].includes(n))throw new Error(`unknown attribute: ${n}`);const old=this.geometryAttributes()[n];const next=numberValue(n,v);if((n==='width'||n==='height')&&next<0)throw new Error(`${n} must be non-negative`);if(n==='x')this.x=next;if(n==='y')this.y=next;if(n==='width')this.width=next;if(n==='height')this.height=next;return old;}
  summary():string{return `rect#${this.id}  x=${this.x} y=${this.y} w=${this.width} h=${this.height}${this.styles.fill?` fill=${this.styles.fill}`:''}`;}
  toSvg(indent=''):string{return serializeElement('rect',this.id,this.getAttributes(),indent);}
}
