#!/usr/bin/env node

const path = require("path")
const fs = require("fs")
const glob = require('glob')
const en = require("../en-US")

const platformFiles = glob.sync('../adex-platform/src/**/*.js')
const modelsFiles = glob.sync('../adex-models/src/**/*.js')
const marketFiles = glob.sync('../adex-market/!(node_modules)**/*.js')
const relayerFiles = glob.sync('../adex-relayer/!(node_modules)**/*.js')

const allFiles = [...platformFiles, ...modelsFiles, ...marketFiles, ...relayerFiles]

console.log('allFiles', allFiles.length);

let allText = ''
allFiles.forEach(f => allText = allText + fs.readFileSync(f).toString())
allText = allText.toLowerCase()

const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const someToSkip = ['_in', 'in_', '_nin', 'nin_', '_allin', 'allin_', '_includ', '_exclud', 'cluding_', 'clude_', '_paus', '_resum', 'pause_', 'pausing_', 'resume_', 'resuming_' ]

const onlyUsed = Object.keys(en)
	// Will catch some props that using t('word', { toUpperCase: true })
	.map(k => k.toLowerCase())
	// Will skip filtering props that using t('word', { isProp: true })
	// If key has digit in most cases is used with loop and will not match
	// Needs manual check at the end
	.filter(k => k.startsWith('prop') || allText.includes(k)  || digits.some( d => k.includes(d)) || someToSkip.some(s => k.includes(s)))
	.map(k => k.toUpperCase())
	.reduce((used, k) => {
		used[k] = en[k]
		return used
	}, {})

console.log('all', Object.keys(en).length)
console.log('used', Object.keys(onlyUsed).length)

var p = path.resolve(process.cwd(), 'en-US.json')
fs.writeFile(p, JSON.stringify(onlyUsed, null, "\t"), function (err) {
	console.log(err || "successfully re-written en-US.json")
	process.exit(err ? 1 : 0)
})
