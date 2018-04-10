const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const merge = require('webpack-merge');
const tsNameofLoader = require('ts-nameof-loader');
//const keysTransformer = require('./clientapp/transformers/custom.ts').default;

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);

    // Configuration in common to both client-side and server-side bundles
    const sharedConfig = () => ({
        stats: { modules: false },
        resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        output: {
            filename: '[name].js',
            publicPath: '/dist/' // Webpack dev middleware, if enabled, handles requests for this URL prefix
        },
        module: {
            rules: [
							{
								test: /\.tsx?$/,
								include: /ClientApp/,
								use: ['awesome-typescript-loader?silent=true', 'ts-nameof-loader']
								//options: {
								//	getCustomTransformers: () => ({ before: [keysTransformer] })
								//}
							}
            ]
        },
				plugins: [
					new CheckerPlugin(),
					new webpack.DefinePlugin({
						__API_URL__: JSON.stringify("http://localhost:49175/")
					})
				]
    });

    // Configuration for client-side bundle suitable for running in browsers
    const clientBundleOutputDir = './wwwroot/dist';
    const clientBundleConfig = merge(sharedConfig(), {
        entry: { 'main-client': './ClientApp/boot-client.tsx' },
        module: {
            rules: [
							//{ test: /\.scss$/, loader: 'typings-for-css-modules-loader?modules&namedExport&camelCase&sass' },
							{ test: /\.css$/, use: ExtractTextPlugin.extract({ use: isDevBuild ? 'css-loader' : 'css-loader?minimize' }) },
							{
								test: /\.scss$/, use: 
									ExtractTextPlugin.extract({
										fallback: 'style-loader',
										use: [
											isDevBuild ? 'css-loader' : 'css-loader?minimize',
											'sass-loader'
										]})
							},
							{ test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' },
							{
								test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
								use: "url-loader?limit=250"
							},
							{
								test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
								use: 'url-loader?limit=250'
							}
            ]
        },
        output: { path: path.join(__dirname, clientBundleOutputDir) },
        plugins: [
						new ExtractTextPlugin('site.css'),

            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/vendor-manifest.json')
            })
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
            // Plugins that apply in production builds only
            new webpack.optimize.UglifyJsPlugin()
        ])
    });

    // Configuration for server-side (prerendering) bundle suitable for running in Node
    const serverBundleConfig = merge(sharedConfig(), {
        resolve: { mainFields: ['main'] },
				entry: { 'main-server': './ClientApp/boot-server.tsx' },
				module: {
					rules: [
						//{ test: /\.scss$/, loader: 'typings-for-css-modules-loader?modules&namedExport&camelCase&sass' },
						{ test: /\.css$/, use: 'css-loader' },
						{ test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' },
						{
							test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
							use: "url-loader?limit=250"
						},
						{
							test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
							use: 'url-loader?limit=250'
						}
					]
				},
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./ClientApp/dist/vendor-manifest.json'),
                sourceType: 'commonjs2',
                name: './vendor'
            })
        ],
        output: {
            libraryTarget: 'commonjs',
            path: path.join(__dirname, './ClientApp/dist')
        },
        target: 'node',
        devtool: 'inline-source-map'
    });

    return [clientBundleConfig, serverBundleConfig];
};