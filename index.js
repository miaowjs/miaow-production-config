var path = require('path');

var amdParse = require('miaow-amd-parse');
var babelParse = require('miaow-babel-parse');
var ftlParse = require('miaow-ftl-parse');
var inlineParse = require('miaow-inline-parse');
var lessParse = require('miaow-less-parse');
var replace = require('miaow-replace');
var urlParse = require('miaow-url-parse');

var jpgMini = require('miaow-jpg-mini');
var pngMini = require('miaow-png-mini');
var cssPack = require('miaow-css-pack');
var cssSprite = require('miaow-css-sprite');
var lowbandwidth = require('miaow-lowbandwidth-task');

var ThirdPartyPlugin = require('miaow-thirdparty-plugin');
var PackPlugin = require('miaow-pack-plugin');

var cssUrlParse = {
	task: urlParse,
	options: {
		regexp: /url\s*\(\s*['"]?([^\/'"][\w_\/\.\-]*)(?:[?#].*?)?['"]?\)/g
	}
};

var inlineContentParse = {
	task: inlineParse,
	options: {
		regexp: /((?:\/\*|<!--)\s*inline\s+['"]([\w\_\/\.\-]+)['"]\s*(?:\*\/|-->))/g,
		type: 'content'
	}
};

var debugReplace = {
	task: replace,
	options: {
		replace: [{test: /__debug__/g, value: 'false'}]
	}
};

var autoprefixer = {
	task: require('miaow-css-autoprefixer'),
	options: {
		browsers: ['> 1%', 'last 2 versions', 'iOS >= 6', 'Android >= 2.1', 'Explorer >= 7', 'Firefox >= 38', 'Chrome >= 30']
	}
};

var jsMini = {
	task: require('miaow-js-mini'),
	options: {
		output: {
			comments: function(node, comment) {
				return comment.type === 'comment2' && comment.value.charAt(0) === '!';
			}
		}
	}
};

var cssMini = {
	task: require('miaow-css-mini'),
	options: {
		compatibility: 'ie7'
	}
};

// 默认配置
var config = {
	// 工作目录
	context: path.resolve('./src'),

	// 输出目录
	output: path.resolve('./release'),

	// 缓存目录
	cache: path.resolve('./cache'),

	environment: 'production',

	// 排除目录
	exclude: [
		'build/**/*',
		'cache/**/*',
		'release/**/*',
		'**/bower_components/**/*',
		'**/node_modules/**/*',
		'**/*.ftl.js',
		'**/*.md',
		'**/bower.json',
		'**/gulpfile.js',
		'**/miaow.config.js',
		'**/miaow.local.js',
		'**/webpack.config.js'
	],

	// 追加hash
	hashLength: 10,

	// hash值连接符
	hashConcat: '.',

	// 域名
	domain: '',

	// 是否调试
	debug: false,

	plugins: [
		new ThirdPartyPlugin({test: '*.+(js|es6)', tasks: [jsMini]}),
		new PackPlugin()
	],

	modules: [
		{
			test: '*.js',
			release: 'html/$0',
			tasks: [
				debugReplace,
				inlineParse,
				urlParse,
				amdParse,
				inlineContentParse,
				jsMini
			]
		},

		{
			test: '*.es6',
			ext: '.js',
			release: 'html/$0',
			tasks: [
				debugReplace,
				inlineParse,
				urlParse,
				{
					task: babelParse,
					options: {
						blacklist: ['strict'],
						optional: ['es7.classProperties'],
						modules: 'amd'
					}
				},
				amdParse,
				inlineContentParse,
				jsMini
			]
		},

		{
			test: 'mobile/**/*.css',
			release: 'html/$0',
			tasks: [
				lowbandwidth,
				inlineParse,
				urlParse,
				cssUrlParse,
				autoprefixer,
				inlineContentParse,
				cssMini,
				cssPack
			]
		},

		{
			test: '*.css',
			release: 'html/$0',
			tasks: [
				cssSprite,
				inlineParse,
				urlParse,
				cssUrlParse,
				autoprefixer,
				inlineContentParse,
				cssMini,
				cssPack
			]
		},

		{
			test: 'mobile/**/*.less',
			ext: '.css',
			release: 'html/$0',
			tasks: [
				inlineParse,
				urlParse,
				lessParse,
				lowbandwidth,
				cssUrlParse,
				autoprefixer,
				inlineContentParse,
				cssMini,
				cssPack
			]
		},

		{
			test: '*.less',
			ext: '.css',
			release: 'html/$0',
			tasks: [
				inlineParse,
				urlParse,
				lessParse,
				cssSprite,
				cssUrlParse,
				autoprefixer,
				inlineContentParse,
				cssMini,
				cssPack
			]
		},

		{
			test: '*.ftl',
			domain: '',
			release: 'FE/$0',
			hashLength: 0,
			tasks: [
				inlineParse,
				urlParse,
				debugReplace,
				{
					task: ftlParse,
					options: {
						macroNameList: ['static', 'docHead', 'docFoot', 'jsFile', 'cssFile'],
						macroArgList: ['js', 'css', 'file', 'mockjax']
					}
				},
				inlineContentParse
			]
		},

		{
			test: '*.+(htm|html|tpl)',
			release: 'html/$0',
			tasks: [
				inlineParse,
				urlParse,
				debugReplace,
				inlineContentParse
			]
		},

		{
			test: '*.+(jpg|jpeg)',
			release: 'html/$0',
			tasks: [
				jpgMini
			]
		},

		{
			test: '*.png',
			release: 'html/$0',
			tasks: [
				pngMini
			]
		},

		{
			test: '*.*',
			release: 'html/$0'
		}
	],

	resolve: {
		moduleDirectory: ['common', '.remote', 'bower_components'],
		extensions: ['.js', '.es6'],
		extensionAlias: {
			'.css': ['.less'],
			'.js': ['.es6']
		}
	}
};

module.exports = config;
