import postcss from "rollup-plugin-postcss"

export default{
    input:"apps/ui/index.js",
    output: {
        file: "apps/ui/build/bundle.js",
        format: "iife"
    },
    treeshake: false,
    plugins:[
        postcss( {
            inject: true,
            minimize: true
        } )
    ]
}