/**
 * @author daberdev
 * @email daber.programing@gmail.com
 * 
 * file ini merupakan file utama dari sistem compile
 * yang memuat bagaimana pengcompilan terhadap file HTML
 * di lakukan dan membuat utilities class dari setiap tag nya
 * 
 * 04:04 WIB 16/04/2022
 */
const {
    parse,
    serialize
} = require('parse5');
const beautify = require('js-beautify').js;
const fs = require("fs");
const crypto = require("crypto");
const CodecError = require('./utils/error');
const prettify = require('html-prettify');
const copase = require("./utils/copase.js");
const {beauty} = require('css-beauty');

// uuid v4
function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.randomUUID(new Uint8Array(1))[0] & 15 >> c / 4).toString("36")
    );
}

// melakukan set terhadap responsive 
let mediaQueryTemplate = {
    "sm": `@media screen and (min-width: 0px) and (max-width: 640px)`,
    "md": `@media screen and (min-width: 641px) and (max-width: 1007px)`,
    "lg": `@media screen and (min-width: 1008px)`
};

// mengambil dan mengcopy source code html dan melakukan manipulasi
// yaitu dengan cara mengubah class utilities menjadi class yang telah di generate
function createHTML(Component, arrayResult, src, result) {

    const rawAttrs = src.substring(Component.sourceCodeLocation.startCol - 1, Component.sourceCodeLocation.endCol - 1).match(/<[a-zA-Z]+(>|.*?[^?]>)/)?.[0].replace(/(?<=\<(\w.*))(\}(\s+|\t|\r|\n)\})/igm, "}}").match(/(?<=\<(\w.*))((\$.(\w*))|(\w*((\=(\".*?\"))|(\=(\{.*?(\}{1,}))))))/igm)?.map(e => ({
        [e.split("=")[0]]: (e.split("=")[1]) ? e.split("=")[1].replace(/(^\{|\}$)/igm, "") : null
    })) || [];

    const tagName = src.substring(Component.sourceCodeLocation.startCol, Component.sourceCodeLocation.startCol + Component.tagName.length);
    const utilitesClass = [];

    // melakukan pengambilan class
    for (let x of rawAttrs) {

        const classField = {};

        if(tagName !== "script") for (let y of (x.class?.replace(/\[.*?\]\s+/igm,"$&=>").split("=>") || [])) {

            const resultCopase = copase.checkValue(copase.splitValue(y.replace(/(\n|\r|\t)/igm,"")));

            if(!classField.hasOwnProperty(resultCopase.parentName)){

                classField[resultCopase.parentName] = resultCopase.nameAfter;               

            }else{

                resultCopase.updateTemplate(classField[resultCopase.parentName],resultCopase.value);

            }

            utilitesClass.push(resultCopase);

        }

    }


    let _result = result;

    for (let x of utilitesClass) {

        _result.source = _result.source.replace(x.nameBefore, x.nameAfter);

    }

    arrayResult.push({
        result: _result.source,
        utilitesClass,
    });

    if (Component.childNodes.length > 0){

        for (let x of Component.childNodes) {

            if (x.nodeName !== "#text"){

                createHTML(x, arrayResult, src, _result);

            }

        }

    }
     
    return arrayResult;

}

module.exports.transform = function(_source, isFirst, current) {

    let source = _source.replace(/(\n|\r|\t)/igm, "");

    // raw data
    let data = parse(source, {
        sourceCodeLocationInfo: true
    }).childNodes[1].childNodes[1].childNodes.filter(e => e.nodeName !== "#text");

    let result = [];
    let templateCopase = {};
    const css = [];
    const finalResult = [];
    const templateBefore = {
        source
    }
  
    for (let x of data) {

        const a = createHTML(x, finalResult, source, templateBefore);
        for (let g of a) {
            css.push(...g.utilitesClass);
        }
        templateCopase = {
            html: a[a.length - 1].result,
            css
        };

    }


    let resultCssAndHTML = {
        html: prettify(templateCopase.html.replace(/\<.*?\>/igm, "\n$&")),
        css: ""
    };

    const mediaSm = [],mediaMd = [],mediaLg = [];

    for (let g of templateCopase.css) {

        if(g.mediaQuery === "sm") mediaSm.push(g.template);
        if(g.mediaQuery === "lg") mediaLg.push(g.template);
        if(g.mediaQuery === "md") mediaMd.push(g.template);
        if(g.mediaQuery.length === 0) resultCssAndHTML.css += g.template;

    }


    resultCssAndHTML.css += (mediaSm.length > 0 ? `${mediaQueryTemplate["sm"]}{${mediaSm.join("\n")}}` : "") +
    (mediaMd.length > 0 ? `${mediaQueryTemplate["md"]}{${mediaMd.join("\n")}}` : "") +
    (mediaLg.length > 0 ? `${mediaQueryTemplate["lg"]}{${mediaLg.join("\n")}}` : "");

    resultCssAndHTML.css = beauty(resultCssAndHTML.css);

    return resultCssAndHTML;
}