#!/usr/bin/env node

"use strict";

const fs = require("fs-extra");
const path = require("path");
const request = require("request-promise-native");
const Cheerio = require("cheerio");
const CheerioAdv = require("cheerio-advanced-selectors");
const cheerio = CheerioAdv.wrap(Cheerio);
const beautify = require("beautify");
const strip = require("remove-html-comments");

process.env["NODE_NO_WARNINGS"] = 1;
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
process.on("uncaughtException",err=>console.error(err));
process.on("unhandledRejection",(err,promise)=>console.error(err,promise));
process.on("SIGINT",()=>{process.exit(1)});
process.setMaxListeners(0);

module.exports = exports;

if (typeof require!=="undefined" && require.main===module && !module.parent) {
	for(let key in exports){global[key]=exports[key];}
	(async ()=>{
		const uris = [
			"https://www.jollyfrogs.com/elf-1-bushy-evergreen-essential-editor-skills",
			"https://www.jollyfrogs.com/elf-2-minty-candycane-the-name-game",
			"https://www.jollyfrogs.com/elf-3-tangle-coalbox-lethal-forensicelfication",
			"https://www.jollyfrogs.com/elf-4-wunorse-openslae-stall-mucking-report",
			"https://www.jollyfrogs.com/elf-5-holly-evergreen-curling-master",
			"https://www.jollyfrogs.com/elf-6-pepper-minstix-yule-log-analysis-cranberry-pi-terminal",
			"https://www.jollyfrogs.com/elf-7-sparkle-redberry-dev-ops-fail",
			"https://www.jollyfrogs.com/elf-8-sugarplum-mary-python-escape-from-la",
			"https://www.jollyfrogs.com/elf-9-shinny-upatree-sleigh-bell-lottery",
			"https://www.jollyfrogs.com/objective-1-orientation-challenge",
			"https://www.jollyfrogs.com/objective-2-directory-browsing",
			"https://www.jollyfrogs.com/objective-3-de-bruijn-sequences",
			"https://www.jollyfrogs.com/objective-4-data-repo-analysis",
			"https://www.jollyfrogs.com/objective-5-ad-privilege-discovery",
			"https://www.jollyfrogs.com/objective-6-badge-manipulation",
			"https://www.jollyfrogs.com/objective-7-hr-incident-response",
			"https://www.jollyfrogs.com/objective-8-network-traffic-forensics",
			"https://www.jollyfrogs.com/objective-9-1-catch-the-malware",
			"https://www.jollyfrogs.com/objective-9-2-identify-the-domain",
			"https://www.jollyfrogs.com/objective-9-3-stop-the-malware",
			"https://www.jollyfrogs.com/objective-9-4-recover-alabasters-password"
		];
		for (const uri of uris) {
			// console.error(`=== ${uri} ===`);
			const html = await request.get(uri,{resolveWithFullResponse:false,simple:false});
			const $ = cheerio.load(html);
			for (const el of $("img").get()) {
				const src = $(el).attr("src");
				const filename = path.basename(src);
				// await request.get(src).pipe(fs.createWriteStream(filename));
				// console.log(uri,"=>",filename);
				$(el).attr("src",filename);
			}
			const title = strip($.html("div.entry-title"))["data"];
			const content = beautify(strip($.html("div.entry-content"))["data"],{format:"html"});
			const preamble = `<!DOCTYPE html><head><link rel="stylesheet" href="style.css" type="text/css" media="all"/><style type="text/css">.code-black-background{color:#e0e0e0;background-color:#1f1f1f;}</style></head><body>`;
			const postamble = "</body></html>";
			const filename = `${/^https:\/\/www\.jollyfrogs\.com\/(\w+\-[\d-]+)\-/.exec(uri)[1]}.html`;
			// fs.writeFileSync(filename,preamble+title+content+postamble);
			// console.log(uri,"=>",filename);

			// let hrefs = [];
			// for (const el of $("div.entry-content a").get()) {
			// 	const href = $(el).attr("href");
			// 	if (href.startsWith("https://www.jollyfrogs.com/wp-content/uploads/")) {
			// 		hrefs.push(href);
			// 	}
			// }
			// hrefs = [...new Set(hrefs)];
			// for (const href of hrefs) {
			// 	console.log(href);
			// } // => filelist
		}
	})();
}
