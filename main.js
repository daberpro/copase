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
const fs = require("fs");
const crypto = require("crypto");
const CodecError = require('./utils/error');
const prettify = require('html-prettify');
const copase = require("./utils/copase.js");
const { beauty } = require('css-beauty');
const postcss = require('postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const { join } = require("path");


/**
 * @description melakukan minify terhadap css
 */
const minifyCss = async (css) => {

    const output = await postcss([cssnano, autoprefixer])
        .process(css)

    return output.css;
}

const HTMLElementTag = { "a": "a", "abbr": "abbr", "acronym": "acronym", "address": "address", "applet": "applet", "area": "area", "article": "article", "aside": "aside", "audio": "audio", "b": "b", "base": "base", "basefont": "basefont", "bdi": "bdi", "bdo": "bdo", "bgsound": "bgsound", "big": "big", "blink": "blink", "blockquote": "blockquote", "body": "body", "br": "br", "button": "button", "canvas": "canvas", "caption": "caption", "center": "center", "cite": "cite", "code": "code", "col": "col", "colgroup": "colgroup", "content": "content", "data": "data", "datalist": "datalist", "dd": "dd", "decorator": "decorator", "del": "del", "details": "details", "dfn": "dfn", "dir": "dir", "div": "div", "dl": "dl", "dt": "dt", "element": "element", "em": "em", "embed": "embed", "fieldset": "fieldset", "figcaption": "figcaption", "figure": "figure", "font": "font", "footer": "footer", "form": "form", "frame": "frame", "frameset": "frameset", "h1": "h1", "h2": "h2", "h3": "h3", "h4": "h4", "h5": "h5", "h6": "h6", "head": "head", "header": "header", "hgroup": "hgroup", "hr": "hr", "html": "html", "i": "i", "iframe": "iframe", "img": "img", "input": "input", "ins": "ins", "isindex": "isindex", "kbd": "kbd", "keygen": "keygen", "label": "label", "legend": "legend", "li": "li", "link": "link", "listing": "listing", "main": "main", "map": "map", "mark": "mark", "marquee": "marquee", "menu": "menu", "menuitem": "menuitem", "meta": "meta", "meter": "meter", "nav": "nav", "nobr": "nobr", "noframes": "noframes", "noscript": "noscript", "object": "object", "ol": "ol", "optgroup": "optgroup", "option": "option", "output": "output", "p": "p", "param": "param", "plaintext": "plaintext", "pre": "pre", "progress": "progress", "q": "q", "rp": "rp", "rt": "rt", "ruby": "ruby", "s": "s", "samp": "samp", "script": "script", "section": "section", "select": "select", "shadow": "shadow", "small": "small", "source": "source", "spacer": "spacer", "span": "span", "strike": "strike", "strong": "strong", "style": "style", "sub": "sub", "summary": "summary", "sup": "sup", "table": "table", "tbody": "tbody", "td": "td", "template": "template", "textarea": "textarea", "tfoot": "tfoot", "th": "th", "thead": "thead", "time": "time", "title": "title", "tr": "tr", "track": "track", "tt": "tt", "u": "u", "ul": "ul", "var": "var", "video": "video", "wbr": "wbr", "xmp": "xmp" }

// uuid v4
function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.randomUUID(new Uint8Array(1))[0] & 15 >> c / 4).toString("36")
    );
}

/**
 * @description melakukan include terhadap component
 * 
 * @param {parse5 HTMLComponent} Component 
 * @param {String} src 
 * @param {String} result 
 * @param {Object} props 
 */
function copyComponentToSource(Component, src, result, props) {

    const rawAttrs = src.substring(Component.sourceCodeLocation.startCol - 1, Component.sourceCodeLocation.endCol - 1).match(/<[a-zA-Z]+(>|.*?[^?]>)/)?.[0].replace(/(?<=\<(\w.*))(\}(\s+|\t|\r|\n)\})/igm, "}}").match(/(?<=\<(\w.*))((\$.(\w*))|(\w*((\=(\".*?\"))|(\=(\{.*?(\}{1,}))))))/igm)?.map(e => ({
        [e.split("=")[0]]: (e.split("=")[1]) ? e.split("=")[1].replace(/(^\{|\}$)/igm, "") : null
    })) || [];

    const tagName = src.substring(Component.sourceCodeLocation.startCol, Component.sourceCodeLocation.startCol + Component.tagName.length);

    if (!HTMLElementTag.hasOwnProperty(tagName)) {

        let component = null;
        let source = result.source;

        for (let g of rawAttrs) {

            if (g.as?.replace(/(\s|\t|\r)/igm, "")) {

                component = `\`${fs.readFileSync(join(process.cwd(), g.as.replace(/\"/igm, ""))).toString("utf-8")}\``;

                try {

                    source = result.source.replace(
                        src.substring(Component.sourceCodeLocation.startCol - 1, Component.sourceCodeLocation.endCol - 1),
                        eval(component)
                    );

                } catch (err) {

                    source = result.source;

                }

            }
            else if (g.each?.replace(/(\s|\t|\r)/igm, "")) {

                const _data = g.each?.replace(/(\s|\t|\r|\")/igm, "");
                const components = [];

                if (props[_data] instanceof Object) {

                    for (let index in props[_data]) {

                        const each = {
                            value: props[_data][index],
                            index
                        }

                        components.push(eval(component));

                    }

                }

                source = result.source.replace(
                    src.substring(Component.sourceCodeLocation.startCol - 1, Component.sourceCodeLocation.endCol - 1),
                    components.join("\n")
                );

            }

        }

        result.source = source;

    }

    if (Component.childNodes.length > 0) {

        for (let x of Component.childNodes) {

            if (x.nodeName !== "#text") {

               copyComponentToSource(x,src,result,props);

            }

        }

    }
}

// melakukan set terhadap responsive 
let mediaQueryTemplate = {
    "sm": `@media screen and (min-width: 0px) and (max-width: 640px)`,
    "md": `@media screen and (min-width: 641px) and (max-width: 1007px)`,
    "lg": `@media screen and (min-width: 1008px)`
};

// mengambil dan mengcopy source code html dan melakukan manipulasi
// yaitu dengan cara mengubah class utilities menjadi class yang telah di generate
/**
 * @description membuat utility class dalam bentuk setengah jadi
 * 
 * @param {Parse5 HTMLComponent} Component 
 * @param {Array} arrayResult 
 * @param {String} src 
 * @param {String} result 
 * @param {Map} pureClass 
 * @returns 
 */
function createHTML(Component, arrayResult, src, result, pureClass) {

    const rawAttrs = src.substring(Component.sourceCodeLocation.startCol - 1, Component.sourceCodeLocation.endCol - 1).match(/<[a-zA-Z]+(>|.*?[^?]>)/)?.[0].replace(/(?<=\<(\w.*))(\}(\s+|\t|\r|\n)\})/igm, "}}").match(/(?<=\<(\w.*))((\$.(\w*))|(\w*((\=(\".*?\"))|(\=(\{.*?(\}{1,}))))))/igm)?.map(e => ({
        [e.split("=")[0]]: (e.split("=")[1]) ? e.split("=")[1].replace(/(^\{|\}$)/igm, "") : null
    })) || [];

    const tagName = src.substring(Component.sourceCodeLocation.startCol, Component.sourceCodeLocation.startCol + Component.tagName.length);
    const utilitesClass = [];


    // melakukan pengambilan class
    for (let x of rawAttrs) {

        const classField = {};
        const uuid = uuidv4();

        if (x.class) for (let y of (x.class?.replace(/\[.*?\]\s+/igm, "$&=>").split("=>") || [])) {

            const resultCopase = copase.checkValue(copase.splitValue(y.replace(/(\n|\r|\t)/igm, "")),uuid);

            if (!classField.hasOwnProperty(resultCopase.parentName)) {

                classField[resultCopase.parentName] = resultCopase.nameAfter;

            } else {

                resultCopase.updateTemplate(classField[resultCopase.parentName], resultCopase.value);

            }

            utilitesClass.push(resultCopase);

        }

    }


    let _result = result;
    const mediaQuery = ["sm","md","lg"];

    for (let x of utilitesClass) {

        if (pureClass.has(x.nameBefore.replace(/(\s+)/igm, "")) && x.mediaQuery.length === 0) {

            x.nameAfter = pureClass.get(x.nameBefore.replace(/(\s+)/igm, ""));

        } else if (x.mediaQuery.length === 0) {

            pureClass.set(x.nameBefore.replace(/(\s+)/igm, ""), x.nameAfter);

        }

        if(mediaQuery.indexOf(x.mediaQuery) === -1 && x.mediaQuery.length !== 0) _result.source = _result.source.replace(x.nameBefore,x.uuid+" ")
        else _result.source = _result.source.replace(x.nameBefore, x.nameAfter + " ");

    }

    arrayResult.push({
        result: _result.source,
        utilitesClass,
    });

    if (Component.childNodes.length > 0) {

        for (let x of Component.childNodes) {

            if (x.nodeName !== "#text") {

                createHTML(x, arrayResult, src, _result, pureClass);

            }

        }

    }

    return arrayResult;

}

/**
 * 
 * @description transformasi sumber source code dan emlakukan generate
 * 
 * @param {SourceFile} _source 
 * @param {Object} props 
 * @returns 
 */
module.exports.transform = async function (_source, props = {}) {

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

    let pureClass = new Map();

    for (let s of data) {

        copyComponentToSource(s, source, templateBefore, props);

    }

    source = templateBefore.source = templateBefore.source.replace(/(\n|\r|\t)/igm, "");
    data = parse(source, {
        sourceCodeLocationInfo: true
    }).childNodes[1].childNodes[1].childNodes.filter(e => e.nodeName !== "#text");


    for (let x of data) {

        const a = createHTML(x, finalResult, source, templateBefore, pureClass, props);
        for (let g of a) {
            css.push(...g.utilitesClass);
        }
        templateCopase = {
            html: a[a.length - 1].result,
            css
        };

    }

    let resultCssAndHTML = {
        html: templateCopase.html,
        css: ""
    };

    const mediaSm = [], mediaMd = [], mediaLg = [], psuedoClass = [];
    const stackOfPsuedoTemplate = new Map();
    const stackOfPsuedoClass = new Map();


    for (let g of templateCopase.css) {

        if (g.mediaQuery === "sm"){

            mediaSm.push(g.template)
        
        }else if (g.mediaQuery === "lg") {

            mediaLg.push(g.template)
        
        }else if (g.mediaQuery === "md") {

            mediaMd.push(g.template)
        
        }else if (g.mediaQuery.length === 0 && !(resultCssAndHTML.css.match(g.nameAfter))){

            resultCssAndHTML.css += g.template

        }else if (g.mediaQuery.length !== 0) {

            if(stackOfPsuedoTemplate.get(g.uuid)){

                if(stackOfPsuedoTemplate.get(g.uuid).indexOf(`[${g.mediaQuery}] ${g.property}:${g.value.replace(/(\[|\])/igm,"")}`) === -1){

                    if(stackOfPsuedoTemplate.get(g.uuid).length === 0){

                        stackOfPsuedoTemplate.get(g.uuid).push(`[${g.mediaQuery}][${g.nameAfter}] ${g.property}:${g.value.replace(/(\[|\])/igm,"")}`)
                        stackOfPsuedoClass.get(g.uuid).push({
                            isFirst: true,
                            psuedo: g.mediaQuery,
                            property: `${g.property}:${g.value.replace(/(\[|\])/igm,"")}`
                        });

                    }else {

                        stackOfPsuedoTemplate.get(g.uuid).push(`[${g.mediaQuery}] ${g.property}:${g.value.replace(/(\[|\])/igm,"")}`);
                        stackOfPsuedoClass.get(g.uuid).push({
                            isFirst: false,
                            psuedo: g.mediaQuery,
                            uuid: g.uuid,
                            property: `${g.property}:${g.value.replace(/(\[|\])/igm,"")}`
                        });

                    }
                }
            }else{

                stackOfPsuedoTemplate.set(g.uuid,[]);
                stackOfPsuedoClass.set(g.uuid,[]);

            }

        }
    }


    for(let x of stackOfPsuedoClass){

        const template = {};
        const uid = {};

        for(let y of x[1]){

            if(template.hasOwnProperty(y.psuedo)){

                template[y.psuedo].push(y.property+";");

            }else{

                template[y.psuedo] = [y.property+";"];

            }


            uid[y.psuedo] = y.uuid;

        }

        for(let g in template){
            
            resultCssAndHTML.html = resultCssAndHTML.html
            .replace(new RegExp(`(${uid[g]}).*(${uid[g]})`,"igm"),`g${uid[g]}`);
            
            resultCssAndHTML.css += `.g${uid[g]}:${g}{
                ${template[g].join("\n")}
            } `;

        }

    }


    resultCssAndHTML.css += (mediaSm.length > 0 ? `${mediaQueryTemplate["sm"]}{${mediaSm.join("\n")}}` : "") +
        (mediaMd.length > 0 ? `${mediaQueryTemplate["md"]}{${mediaMd.join("\n")}}` : "") +
        (mediaLg.length > 0 ? `${mediaQueryTemplate["lg"]}{${mediaLg.join("\n")}}` : "");

    resultCssAndHTML.css = beauty(await minifyCss(resultCssAndHTML.css.replace(/(\n|\t|\r)/igm,"")));
    resultCssAndHTML.html = prettify(resultCssAndHTML.html.replace(/\<.*?\>/igm,"\n$&"))

    return resultCssAndHTML;
}