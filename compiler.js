#! /usr/bin/env node

/**
 * @author daberdev
 * @email daber.programing@gmail.com
 * 
 * file ini berisi program cli untuk di jalankan langsung di dalam
 * folder kerja
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
const chalk = require('chalk');  
const boxen = require('boxen');

console.log(chalk.hex('#00ff00')("info : "),chalk.hex('#83aaff')("jalankan copase --help untuk melihat semua command\n\n"));
const argv = process.argv.slice(2);
const usage =  chalk.hex('#83aaff')("\nUsage: copase");
const listCommand = {
	"--help"(){

		console.log(usage);  
	    console.log('\nOptions:\r')  
	    console.log('\t--version\t      ' + 'Show version number.' + '\t\t' + '[boolean]\r')  
	    console.log('\t--help\t\t      ' + 'Show help.' + '\t\t\t' + '[boolean]\n')  

	    console.log("\n" + boxen(chalk.hex('#83aaff').bold("Create By daberdev \n email : daber.coding@gmail.com\ngithub: https://github.com/daberpro \n\n"+chalk.yellow("silahkan berkontribusi \nuntuk ikut serta melakukan pengembangan \ngithub : https://github.com/daberpro/copase")), {padding: 1, borderColor: 'white', dimBorder: true,borderStyle: "round"}) + "\n");
	    process.exit(1);
    },
	"--version"(){

		console.log("\n" + boxen(chalk.hex('#83aaff').bold("Copase version : "+require("./package.json").version), {padding: 1, borderColor: 'white', dimBorder: true,borderStyle: "round"}) + "\n");
        process.exit(1);
	}
}

for(let x of argv){

	listCommand[x]();

}

// melakukan pengambilan source dan membuat 
// source css dari setiap source code html
// dengan sumber kode html berasal dari folder source
// dan hasilnya akan di tulis di dalam folder result
if (fs.existsSync(process.cwd() + "/source")) {

    fs.readdirSync(process.cwd() + "/source").forEach(async file => {

        if (/\.html$/igm.test(file)) {

            const copase = await transform(fs.readFileSync(join(process.cwd(), "source", file)).toString());

            if (fs.existsSync(process.cwd() + "/result")) {

                fs.writeFileSync(join(process.cwd() + "/result", file), copase.html);
                fs.writeFileSync(join(process.cwd() + "/result", file.replace(/\.html$/igm, ".css")), copase.css.replace(/\t/igm, ""));

            } else {

                fs.mkdirSync(process.cwd() + "/result");
                fs.writeFileSync(join(process.cwd() + "/result", file), copase.html);
                fs.writeFileSync(join(process.cwd() + "/result", file.replace(/\.html$/igm, ".css")), copase.css.replace(/\t/igm, ""));

            }

            console.log(`compile ${chalk.yellow(file)} to /result`);

        }

    });

} else {

    console.log("folder source tidak di temukan");

}
