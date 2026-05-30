import cfg from '#root/tsconfig.json' with { type: 'json' };

console.log(import.meta.resolve('#root/tsconfig.json'), cfg);