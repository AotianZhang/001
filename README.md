# SVG Editor CLI

Phase 1 CLI SVG editor implemented in TypeScript with an object-oriented shape model and the Command pattern for undo/redo.

## Requirements

- Node.js 22.7 or newer (the project uses Node's built-in TypeScript transformation).

## Run

```powershell
npm run cli
```

Commands can also be replayed from a file:

```powershell
node --experimental-transform-types src/cli.ts < commands.txt
```

The complete command reference and architecture notes are in [`doc/README.md`](doc/README.md).
