export type ShapeType = 'rect' | 'circle' | 'ellipse' | 'line' | 'text' | 'g';
export type Attrs = Record<string, string>;
const shared = new Set(['fill', 'stroke', 'stroke-width']);
export abstract class Shape {
  private parentShape: Shape | null = null;
  protected styles: Attrs = {};
  protected constructor(public readonly type: ShapeType, public readonly id: string, styles: Attrs = {}) { this.styles = {...styles}; }
  get parent(): Shape | null { return this.parentShape; }
  setParent(parent: Shape | null): void { this.parentShape = parent; }
  getAttr(name: string): string | undefined { return this.getAttributes()[name]; }
  getAttributes(): Attrs { return {...this.geometryAttributes(), ...this.styles}; }
  setAttribute(name: string, value: string | undefined): string | undefined {
    if (shared.has(name)) { if(name==='stroke-width'&&value!==undefined&&(!Number.isFinite(Number(value))||Number(value)<0))throw new Error('stroke-width must be a non-negative number');const old=this.styles[name];if(value===undefined)delete this.styles[name];else this.styles[name]=value;return old; }
    return this.setGeometryAttribute(name,value);
  }
  abstract isContainer(): boolean;
  abstract children(): Shape[];
  abstract addChild(child: Shape, index?: number): void;
  abstract removeChild(child: Shape): number;
  abstract clone(): Shape;
  abstract move(dx: number, dy: number): void;
  abstract scale(factor: number): void;
  abstract summary(): string;
  abstract toSvg(indent?: string): string;
  protected abstract geometryAttributes(): Attrs;
  protected abstract setGeometryAttribute(name:string,value:string|undefined):string|undefined;
  contains(candidate: Shape): boolean { return this.children().some(c => c === candidate || c.contains(candidate)); }
}
export function numberValue(name:string,value:string|undefined):number{if(value===undefined||value.trim()==='')throw new Error(`${name} must be a number`);const n=Number(value);if(!Number.isFinite(n))throw new Error(`${name} must be a finite number`);return n;}
export function escapeXml(v:string):string{return v.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');}
export function formatNumber(n:number):string{return Object.is(n,-0)?'0':String(n);}
export function serializeElement(tag:string,id:string,attrs:Attrs,indent=''):string{const rendered=Object.entries(attrs).map(([k,v])=>`${k}="${escapeXml(v)}"`).join(' ');return `${indent}<${tag} id="${escapeXml(id)}"${rendered?` ${rendered}`:''}/>`;}
