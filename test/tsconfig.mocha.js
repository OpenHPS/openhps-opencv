require("ts-node").register({
    compilerOptions: {
        module: "commonjs",
        target: "es6",
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        strictNullChecks: false,
        noUnusedLocals: false,
        pretty: true,
        lib: ["es2017"]
    },
    transpileOnly: true
});
