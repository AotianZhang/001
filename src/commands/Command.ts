import {DocumentModel} from '../domain/Document.ts';
export interface Command { execute(doc:DocumentModel):string; undo(doc:DocumentModel):void; }
export class MutationCommand implements Command {
  private before?:DocumentModel;private after?:DocumentModel;private result='';
  constructor(private readonly mutation:(doc:DocumentModel)=>string){}
  execute(doc:DocumentModel):string{if(this.after){doc.replace(this.after);return this.result;}this.before=doc.clone();try{this.result=this.mutation(doc);this.after=doc.clone();return this.result;}catch(error){doc.replace(this.before);throw error;}}
  undo(doc:DocumentModel):void{if(!this.before)throw new Error('command has not executed');doc.replace(this.before);}
}
export class History {
  private undoStack:Command[]=[];private redoStack:Command[]=[];private blocked=false;
  execute(command:Command,doc:DocumentModel):string{const result=command.execute(doc);this.undoStack.push(command);this.redoStack=[];this.blocked=false;return result;}
  undo(doc:DocumentModel):string{if(this.blocked)throw new Error('undo not allowed after io command');const c=this.undoStack.pop();if(!c)throw new Error('nothing to undo');c.undo(doc);this.redoStack.push(c);return 'ok';}
  redo(doc:DocumentModel):string{if(this.blocked)throw new Error('redo not allowed after io command');const c=this.redoStack.pop();if(!c)throw new Error('nothing to redo');c.execute(doc);this.undoStack.push(c);return 'ok';}
  block():void{this.blocked=true;this.undoStack=[];this.redoStack=[];}
  unblock():void{this.blocked=false;}
}
