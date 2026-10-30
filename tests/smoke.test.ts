import assert from 'node:assert/strict';
import {execute} from '../src/cli.ts';
import {writeFileSync,readFileSync,unlinkSync} from 'node:fs';

execute('init 400 200');
assert.match(execute('create g flow')!,/g#flow created/);
assert.match(execute('create rect start 30 70 120 60 #4a90d9 in flow')!,/created in g#flow/);
assert.match(execute('create text label 60 100 "Hello world" in flow')!,/created in g#flow/);
assert.match(execute('move flow 10 20')!,/moved/);
assert.match(execute('tree')!,/g#flow[\s\S]*rect#start/);
execute('undo'); assert.match(execute('tree')!,/x=30 y=70/);
execute('redo'); assert.match(execute('tree')!,/x=40 y=90/);
assert.throws(()=>execute('scale flow 0'),/scale factor must be positive/);
assert.match(execute('set label text "Changed text"')!,/updated/);
const file='tests/tmp.svg';execute(`save ${file}`);const xml=readFileSync(file,'utf8');assert.match(xml,/<svg/);unlinkSync(file);
writeFileSync(file,'<svg width="100" height="80"><rect x="1" y="2" width="3" height="4"/></svg>');const read=execute(`read ${file}`)!;assert.match(read,/warning: assigned id rect1/);unlinkSync(file);
console.log('smoke tests passed');
