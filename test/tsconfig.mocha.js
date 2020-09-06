require("@babel/register")({
    presets: ["@babel/preset-env"],
    plugins: [
        ["@babel/plugin-transform-runtime"]
    ],
    only: ['node_modules/@openhps/**/*.js', 'node_modules/three/src/**/*.js'],
    cache: true,
});
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
