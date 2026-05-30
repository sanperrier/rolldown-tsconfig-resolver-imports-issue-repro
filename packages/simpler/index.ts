import cfg from '#base-tsconfig-json' with { type: 'json' };

console.log(import.meta.resolve('#base-tsconfig-json'), cfg);