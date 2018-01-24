require('colors')
const path = require('path')
const fs = require('fs')


const logger = {

	log(log) {
		if (typeof log === 'string') console.log('@yqb '.magenta + 'Log: '.cyan + log.cyan)
		else console.log('[ATTACH-DEV] '.magenta + 'Log:\n'.cyan, log)
	}
}


const walk = (dir, callback) => {
	fs.readdir(dir, (err, files) => {
		if (err) throw err
		files.forEach(item => {
			const filepath = path.join(dir, item)
			if (fs.lstatSync(filepath).isDirectory()) walk(filepath, callback)
			else callback(filepath)
		})
	})
}


function CleanBuildOnWatchPlugin(options) {
	this.disable = (options && options.disable)
	this.disable = (process.env.NODE_ENV === 'production')
}


CleanBuildOnWatchPlugin.prototype.apply = function (compiler) {

	let isWatching = false

	compiler.plugin('watch-run', (compiler, next) => {
		isWatching = true
		next()
	})

	compiler.plugin('done', () => {

		if (!this.disable && isWatching) {
			const buildDir = compiler.options.output.path
			const manifest = path.join(buildDir, "manifest.json")
			const fileList = JSON.parse(fs.readFileSync(manifest))
			let newlyCreatedFile = {}
			for(let fp in fileList){
				newlyCreatedFile[path.join(buildDir, fileList[fp])] = true
			}
			newlyCreatedFile[manifest] = true

			const deleteFilesIfOld = file => {
				if (!newlyCreatedFile[file]) {
					logger.log('removed old file: '.cyan + file.magenta)
					fs.unlinkSync(file)
				}
			}

			walk(buildDir, deleteFilesIfOld)
		}

	})
}

module.exports = CleanBuildOnWatchPlugin