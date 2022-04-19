/**
 * @author daberdev
 * @email daber.programing@gmail.com
 * 
 * file ini berisi program untuk di jalankan di dalam file javascript
 * dan di eksekusi oleh node js
 * 
 * 04:04 WIB 16/04/2022
 */

const fs = require('fs');
const {
    transform
} = require("./main.js");
const {
    join
} = require("path");

// membuat fungsi compile yang di exports
// agar user bisa menggunakan copase melalui node js dengan file
/**
 * @description melakukan compile dan transofrmasi sebagai module
 * 
 * @param {{SourceDir,outDir,config}} args 
 * @returns 
 */
module.exports = function(args = {sourceDir : "", outDir : "", config: {}}) {

    const result = {};

    if (fs.existsSync(args.sourceDir)) {

        fs.readdirSync(args.sourceDir).forEach(async file => {

            // mengambil setiap file html 
            if (/\.html$/igm.test(file)) {

                const copase = await transform(fs.readFileSync(join(args.sourceDir, file)).toString(),config);
                result[file] = copase;

                if (fs.existsSync(args.outDir)) {

                    fs.writeFileSync(join(args.outDir, file), copase.html);
                    fs.writeFileSync(join(args.outDir, file.replace(/\.html$/igm, ".css")), copase.css.replace(/\t/igm, ""));

                } else {

                    fs.mkdirSync(args.outDir);
                    fs.writeFileSync(join(args.outDir, file), copase.html);
                    fs.writeFileSync(join(args.outDir, file.replace(/\.html$/igm, ".css")), copase.css.replace(/\t/igm, ""));

                }

            }

        });

    } else {

        console.log("folder source tidak di temukan");

    }

    return result;
}