import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import {terser} from 'rollup-plugin-terser';

export default [{
    input: 'src/scroll.observer.js',
    output: [
        {
            file: 'dist/scroll.observer.umd.js',
            format: 'umd',
            name: 'ScrollObserver',
            plugins: [
                getBabelOutputPlugin({
                    allowAllFormats: true,
                    babelrc: false,
                    presets: [
                        '@babel/preset-env',
                    ]
                })
            ]
        },
        {
            file: 'dist/scroll.observer.umd.min.js',
            format: 'umd',
            name: 'ScrollObserver',
            plugins: [
                getBabelOutputPlugin({
                    allowAllFormats: true,
                    babelrc: false,
                    presets: [
                        '@babel/preset-env',
                    ]
                }),
                terser()
            ]
        },
    ],
}];