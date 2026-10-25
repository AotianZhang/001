import type {Shape} from './Shape.ts';
import {GroupShape} from './GroupShape.ts';
export class DocumentModel {
  readonly root = new GroupShape('__root');
  private byId = new Map<string, Shape>();
  path?: string;
  constructor(public width=800, public height=600){this.byId.set(this.root.id,this.root);}
  register(shape:Shape):void{if(this.byId.has(shape.id))throw new Error(`id already exists: ${shape.id}`); this.byId.set(shape.id,shape); for(const c of shape.children())this.register(c);}
  unregister(shape:Shape):void{for(const c of shape.children())this.unregister(c); this.byId.delete(shape.id);}
  find(id:string):Shape|undefined{return this.byId.get(id);}
  add(shape:Shape,parent:GroupShape=this.root):void{this.register(shape); parent.addChild(shape);}
  remove(shape:Shape):number{const p=shape.parent;if(!p)throw new Error('cannot remove root'); const i=p.removeChild(shape);this.unregister(shape);return i;}
  count():number{return this.byId.size-1;}
  all():Shape[]{return [...this.byId.values()].filter(s=>s!==this.root);}
  clone():DocumentModel{const d=new DocumentModel(this.width,this.height);d.path=this.path;for(const c of this.root.children())d.add(c.clone());return d;}
  replace(other:DocumentModel):void{this.width=other.width;this.height=other.height;this.path=other.path;for(const c of this.root.children())this.unregister(c);for(const c of this.root.children())this.root.removeChild(c);for(const c of other.root.children())this.add(c.clone());}
}
