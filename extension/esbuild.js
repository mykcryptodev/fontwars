const esbuild = require('esbuild');
const { watch } = process.argv.includes('--watch');

const buildOptions = {
	entryPoints: ['./src/extension.ts'],
	bundle: true,
	outfile: 'out/extension.js',
	external: ['vscode'],
	format: 'cjs',
	platform: 'node',
	sourcemap: true,
	logLevel: 'info'
};

if (watch) {
	console.log('Starting watch mode...');
	esbuild.context(buildOptions).then(ctx => {
		ctx.watch();
		console.log('Watching for changes...');
	}).catch(err => {
		console.error('Watch error:', err);
		process.exit(1);
	});
} else {
	console.log('Building...');
	esbuild.build(buildOptions).then(() => {
		console.log('Build complete!');
	}).catch(err => {
		console.error('Build error:', err);
		process.exit(1);
	});
}
