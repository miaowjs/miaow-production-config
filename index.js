var path = require('path');

var amdParse = require('miaow-amd-parse');
var autoprefixer = require('miaow-css-autoprefixer');
var cssMini = require('miaow-css-mini');
var cssPack = require('miaow-css-pack');
var cssSprite = require('miaow-css-sprite');
var ftlParse = require('miaow-ftl-parse');
var inlineParse = require('miaow-inline-parse');
var jpgMini = require('miaow-jpg-mini');
var jsMini = require('miaow-js-mini');
var lessParse = require('miaow-less-parse');
var pngMini = require('miaow-png-mini');
var replace = require('miaow-replace');
var urlParse = require('miaow-url-parse');

var cssUrlParse = {
	plugin: urlParse,
	option: {
		reg: /url\s*\(\s*['"]?([\w_\/\.\-]+)(?:[?#].*?)?['"]?\)/g
	}
};
var inlineContentParse = {
	plugin: inlineParse,
	option: {
		regexp: /((?:\/\*|<!--)\s*inline\s+['"]([\w\_\/\.\-]+)['"](?:\*\/|-->))/g,
		type: 'content'
	}
};

// 默认配置
var config = {
	// 工作目录
	cwd: path.resolve('./src'),

	// 输出目录
	output: path.resolve('./release'),

	// 缓存目录
	cache: path.resolve('./cache'),

	environment: 'production',

	// 排除目录
	exclude: [
		'**/node_modules/**/*',
		'**/*.ftl.js',
		'**/*.md',
		'**/bower.json',
		'**/gulpfile.js',
		'**/miaow.config.js',
		'**/miaow.local.js',
		'**/package.json'
	],

	hash: 10,

	// hash值连接符
	hashConcat: '.',

	// 域名
	domain: '',

	module: {
		tasks: [
			{
				test: /(require|jquery|jquery\/.*)\.js$/,
				plugins: [
					jsMini
				]
			},
			{
				test: /\.js$/,
				plugins: [
					{
						plugin: replace,
						option: {
							replace: [{test: /__debug__/g, value: 'false'}]
						}
					},
					urlParse,
					{
						plugin: amdParse,
						option: {
							ignore: ['jquery'],
							pack: true
						}
					},
					inlineContentParse,
					jsMini
				]
			},

			{
				test: /\.css$/,
				plugins: [
					cssSprite,
					urlParse,
					cssUrlParse,
					autoprefixer,
					cssPack,
					inlineContentParse,
					cssMini
				]
			},

			{
				test: /\.less$/,
				plugins: [
					urlParse,
					lessParse,
					cssSprite,
					cssUrlParse,
					autoprefixer,
					cssPack,
					inlineContentParse,
					cssMini
				]
			},

			{
				test: /\.ftl$/,
				plugins: [
					urlParse,
					{
						plugin: replace,
						option: {
							replace: [{test: /__debug__/g, value: 'false'}]
						}
					},
					{
						plugin: ftlParse,
						option: {
							macroNameList: ['static', 'docHead', 'docFoot', 'jsFile', 'cssFile'],
							macroArgList: ['js', 'css', 'file', 'mockjax'],
							macroDebug: false
						}
					},
					inlineContentParse
				]
			},

			{
				test: /\.png$/,
				plugins: [
					pngMini
				]
			},

			{
				test: /\.jp[e]?g$/,
				plugins: [
					jpgMini
				]
			}
		],

		// 文件生成配置
		road: [
			{
				test: /\.ftl$/,
				useHash: false,
				domain: ''
			},

			{
				test: /(.*)\.less$/,
				release: '$1.css'
			}
		]
	},

	resolve: {
		moduleDirectory: ['common', ".remote"],
		extensions: ['.js'],
		extensionAlias: {
			'.css': ['.less']
		}
	}
};

module.exports = config;
