# grunt-bust-requirejs-cache

> Bust Require.js module file cache.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-bust-requirejs-cache --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-bust-requirejs-cache');
```

## The "bust_requirejs_cache" task

This task will parse the require function in your html source file just like `require(['jquery', 'app/page-main'])` to get your module name `jquery` and `app/page-main`, and then add the file content check sum hash code after the original module name.

See more about [cache bust](https://www.google.com.hk/?gws_rd=ssl#q=cache+bust).

### Overview
In your project's Gruntfile, add a section named `bust_requirejs_cache` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  bust_requirejs_cache: {
    default: {
        options: {
            appDir: 'dist',
            ignorePatterns: ['jquery', 'rs-config']
        },
        files: [
            {
                expand: true,
                cwd: 'dist',
                src: 'page/**/*.html',
                dest: 'dist'
            }
        ]
    }
  },
});
```

### Options

#### options.appDir
Type: `String`
Default value: `''`

The base dir.

#### options.ignorePatterns
Type: `Array`
Default value: `[]`

Patterns that the task not parse.

### Usage Examples

#### Custom Options
In this example the task process files in tmp dir. The task parse all the html files in page dir but the jquery module.

```js
grunt.initConfig({
  bust_requirejs_cache: {
    options: {
		ignorePatterns: ['jquery'],
		appDir: 'tmp'
	},
    files: [
        {
            expand: true,
            cwd: 'dist',
            src: 'page/**/*.html',
            dest: 'dist'
        }
    ]
  },
});
```
``` html
<!doctype html>
<html>
	<head>
		<title>Hello world!</title>
		<link rel="stylesheet" href="../css/global.css" type="text/css">
		<link rel="stylesheet" href="../css/index.css" type="text/css">
	<head>
	<body class="bg">

		<div class="box green">
			<img src="../images/2.jpg">
		</div>
        <script src="../js/lib/require.js" data-main="../js/rs-config"></script>
		<script>
			require(['rs-config'], function(){
				require(['jquery', 'app/page-main'], function($){
					console.log($('body'));
				});
			})
		</script>
	</body>
</html>
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
### v0.2.0
change module define, instead of change file content now add requirejs config path

### v0.1.0
beta version
