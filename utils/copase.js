/**
 * @author daberdev
 * @email daber.programing@gmail.com
 * 
 * file ini merupakan file yang di gunakan untuk mengubah semua data yang di ambil
 * dari compiler dan melakukan manipulasi data
 * 
 * 04:04 WIB 16/04/2022
 */
// membuat aturan dalam mengambil class
// attribute class akan memliki beberapa value
// value yang di miliki akan di gunakan untuk membuat class template
// setiap class akan di pisahkan oleh tanda - 
// dan class nya akan terbagi menjadi induk class dan sub class

const crypto = require("crypto");

function uuidv4() {
	return ([1e7] + -1e3).replace(/[018]/g, c =>
		(c ^ crypto.randomUUID(new Uint8Array(1))[0] & 15 >> c / 4).toString("36")
	);
}


// membuat fungsi untuk memisahkan value dengan -
function splitValue(className){

	className = className.replace(/(^\"|\"$)/igm,"");

	const token = [
	...className.substring(0,className.indexOf("[")-1).split("-"),
	className.substring(className.indexOf("["),className.length)
	];

	// melakukan pengambilan child
	let child = [];

	if(token.length > 1){

		for(let x in token){

			child.push({
				name: (/(\w.*:)/igm.test(token[x])) ? token[x].replace(/(^\"|\"$|(\w.*:))/igm,"") : token[x].replace(/(^\"|\"$)/igm,""),
				position: parseInt(x),
				type: /\[.*?\]/igm.test(token[x]) ? "value" : "declaration",
				mediaQuery: (/(\w.*:)/igm.test(token[x])) ? token[x].match(/(\w.*:)/igm)[0].replace(/\:$/igm,"") : ""
			});

		}

	}

	// melakukan pengideks-an token 
	return {
		parentName: token[0].replace(/(^\"|\"$|(\w.*:))/igm,""),
		fullClassName: token.join("-").replace(/(^\"|\"$)/igm,""),
		copyOfPureClass: child.map(e =>{
			if(e.type !== "value"){

				return e.name;

			}else{

				return null;

			}
		}).filter(e => e !== null).join("-"),
		value: token[token.length-1].replace(/\"/igm,""),
		child,
		mediaQuery: (/(\w.*:)/igm.test(token[0])) ? token[0].match(/(\w.*:)/igm)[0].replace(/\:$/igm,"") : ""
	};

}


// mengambil hasil split value dan melakukan pengechekan

function checkValue(dataSplited){

	const cssMatch = `accentColor additiveSymbols alignContent alignItems alignSelf alignmentBaseline all animation animationDelay animationDirection animationDuration animationFillMode animationIterationCount animationName animationPlayState animationTimingFunction appRegion appearance ascentOverride aspectRatio backdropFilter backfaceVisibility background backgroundAttachment backgroundBlendMode backgroundClip backgroundColor backgroundImage backgroundOrigin backgroundPosition backgroundPositionX backgroundPositionY backgroundRepeat backgroundRepeatX backgroundRepeatY backgroundSize baselineShift blockSize border borderBlock borderBlockColor borderBlockEnd borderBlockEndColor borderBlockEndStyle borderBlockEndWidth borderBlockStart borderBlockStartColor borderBlockStartStyle borderBlockStartWidth borderBlockStyle borderBlockWidth borderBottom borderBottomColor borderBottomLeftRadius borderBottomRightRadius borderBottomStyle borderBottomWidth borderCollapse borderColor borderEndEndRadius borderEndStartRadius borderImage borderImageOutset borderImageRepeat borderImageSlice borderImageSource borderImageWidth borderInline borderInlineColor borderInlineEnd borderInlineEndColor borderInlineEndStyle borderInlineEndWidth borderInlineStart borderInlineStartColor borderInlineStartStyle borderInlineStartWidth borderInlineStyle borderInlineWidth borderLeft borderLeftColor borderLeftStyle borderLeftWidth borderRadius borderRight borderRightColor borderRightStyle borderRightWidth borderSpacing borderStartEndRadius borderStartStartRadius borderStyle borderTop borderTopColor borderTopLeftRadius borderTopRightRadius borderTopStyle borderTopWidth borderWidth bottom boxShadow boxSizing breakAfter breakBefore breakInside bufferedRendering captionSide caretColor clear clip clipPath clipRule color colorInterpolation colorInterpolationFilters colorRendering colorScheme columnCount columnFill columnGap columnRule columnRuleColor columnRuleStyle columnRuleWidth columnSpan columnWidth columns contain containIntrinsicBlockSize containIntrinsicHeight containIntrinsicInlineSize containIntrinsicSize containIntrinsicWidth content contentVisibility counterIncrement counterReset counterSet cursor cx cy d descentOverride direction display dominantBaseline emptyCells fallback fill fillOpacity fillRule filter flex flexBasis flexDirection flexFlow flexGrow flexShrink flexWrap float floodColor floodOpacity font fontDisplay fontFamily fontFeatureSettings fontKerning fontOpticalSizing fontSize fontStretch fontStyle fontSynthesis fontSynthesisSmallCaps fontSynthesisStyle fontSynthesisWeight fontVariant fontVariantCaps fontVariantEastAsian fontVariantLigatures fontVariantNumeric fontVariationSettings fontWeight forcedColorAdjust gap grid gridArea gridAutoColumns gridAutoFlow gridAutoRows gridColumn gridColumnEnd gridColumnGap gridColumnStart gridGap gridRow gridRowEnd gridRowGap gridRowStart gridTemplate gridTemplateAreas gridTemplateColumns gridTemplateRows height hyphens imageOrientation imageRendering inherits initialValue inlineSize inset insetBlock insetBlockEnd insetBlockStart insetInline insetInlineEnd insetInlineStart isolation justifyContent justifyItems justifySelf left letterSpacing lightingColor lineBreak lineGapOverride lineHeight listStyle listStyleImage listStylePosition listStyleType margin marginBlock marginBlockEnd marginBlockStart marginBottom marginInline marginInlineEnd marginInlineStart marginLeft marginRight marginTop marker markerEnd markerMid markerStart mask maskType maxBlockSize maxHeight maxInlineSize maxWidth maxZoom minBlockSize minHeight minInlineSize minWidth minZoom mixBlendMode negative objectFit objectPosition offset offsetDistance offsetPath offsetRotate opacity order orientation orphans outline outlineColor outlineOffset outlineStyle outlineWidth overflow overflowAnchor overflowClipMargin overflowWrap overflowX overflowY overscrollBehavior overscrollBehaviorBlock overscrollBehaviorInline overscrollBehaviorX overscrollBehaviorY pad padding paddingBlock paddingBlockEnd paddingBlockStart paddingBottom paddingInline paddingInlineEnd paddingInlineStart paddingLeft paddingRight paddingTop page pageBreakAfter pageBreakBefore pageBreakInside pageOrientation paintOrder perspective perspectiveOrigin placeContent placeItems placeSelf pointerEvents position prefix quotes r range resize right rowGap rubyPosition rx ry scrollBehavior scrollMargin scrollMarginBlock scrollMarginBlockEnd scrollMarginBlockStart scrollMarginBottom scrollMarginInline scrollMarginInlineEnd scrollMarginInlineStart scrollMarginLeft scrollMarginRight scrollMarginTop scrollPadding scrollPaddingBlock scrollPaddingBlockEnd scrollPaddingBlockStart scrollPaddingBottom scrollPaddingInline scrollPaddingInlineEnd scrollPaddingInlineStart scrollPaddingLeft scrollPaddingRight scrollPaddingTop scrollSnapAlign scrollSnapStop scrollSnapType scrollbarGutter shapeImageThreshold shapeMargin shapeOutside shapeRendering size sizeAdjust speak speakAs src stopColor stopOpacity stroke strokeDasharray strokeDashoffset strokeLinecap strokeLinejoin strokeMiterlimit strokeOpacity strokeWidth suffix symbols syntax system tabSize tableLayout textAlign textAlignLast textAnchor textCombineUpright textDecoration textDecorationColor textDecorationLine textDecorationSkipInk textDecorationStyle textDecorationThickness textEmphasis textEmphasisColor textEmphasisPosition textEmphasisStyle textIndent textOrientation textOverflow textRendering textShadow textSizeAdjust textTransform textUnderlineOffset textUnderlinePosition top touchAction transform transformBox transformOrigin transformStyle transition transitionDelay transitionDuration transitionProperty transitionTimingFunction unicodeBidi unicodeRange userSelect userZoom vectorEffect verticalAlign visibility webkitAlignContent webkitAlignItems webkitAlignSelf webkitAnimation webkitAnimationDelay webkitAnimationDirection webkitAnimationDuration webkitAnimationFillMode webkitAnimationIterationCount webkitAnimationName webkitAnimationPlayState webkitAnimationTimingFunction webkitAppRegion webkitAppearance webkitBackfaceVisibility webkitBackgroundClip webkitBackgroundOrigin webkitBackgroundSize webkitBorderAfter webkitBorderAfterColor webkitBorderAfterStyle webkitBorderAfterWidth webkitBorderBefore webkitBorderBeforeColor webkitBorderBeforeStyle webkitBorderBeforeWidth webkitBorderBottomLeftRadius webkitBorderBottomRightRadius webkitBorderEnd webkitBorderEndColor webkitBorderEndStyle webkitBorderEndWidth webkitBorderHorizontalSpacing webkitBorderImage webkitBorderRadius webkitBorderStart webkitBorderStartColor webkitBorderStartStyle webkitBorderStartWidth webkitBorderTopLeftRadius webkitBorderTopRightRadius webkitBorderVerticalSpacing webkitBoxAlign webkitBoxDecorationBreak webkitBoxDirection webkitBoxFlex webkitBoxOrdinalGroup webkitBoxOrient webkitBoxPack webkitBoxReflect webkitBoxShadow webkitBoxSizing webkitClipPath webkitColumnBreakAfter webkitColumnBreakBefore webkitColumnBreakInside webkitColumnCount webkitColumnGap webkitColumnRule webkitColumnRuleColor webkitColumnRuleStyle webkitColumnRuleWidth webkitColumnSpan webkitColumnWidth webkitColumns webkitFilter webkitFlex webkitFlexBasis webkitFlexDirection webkitFlexFlow webkitFlexGrow webkitFlexShrink webkitFlexWrap webkitFontFeatureSettings webkitFontSmoothing webkitHighlight webkitHyphenateCharacter webkitJustifyContent webkitLineBreak webkitLineClamp webkitLocale webkitLogicalHeight webkitLogicalWidth webkitMarginAfter webkitMarginBefore webkitMarginEnd webkitMarginStart webkitMask webkitMaskBoxImage webkitMaskBoxImageOutset webkitMaskBoxImageRepeat webkitMaskBoxImageSlice webkitMaskBoxImageSource webkitMaskBoxImageWidth webkitMaskClip webkitMaskComposite webkitMaskImage webkitMaskOrigin webkitMaskPosition webkitMaskPositionX webkitMaskPositionY webkitMaskRepeat webkitMaskRepeatX webkitMaskRepeatY webkitMaskSize webkitMaxLogicalHeight webkitMaxLogicalWidth webkitMinLogicalHeight webkitMinLogicalWidth webkitOpacity webkitOrder webkitPaddingAfter webkitPaddingBefore webkitPaddingEnd webkitPaddingStart webkitPerspective webkitPerspectiveOrigin webkitPerspectiveOriginX webkitPerspectiveOriginY webkitPrintColorAdjust webkitRtlOrdering webkitRubyPosition webkitShapeImageThreshold webkitShapeMargin webkitShapeOutside webkitTapHighlightColor webkitTextCombine webkitTextDecorationsInEffect webkitTextEmphasis webkitTextEmphasisColor webkitTextEmphasisPosition webkitTextEmphasisStyle webkitTextFillColor webkitTextOrientation webkitTextSecurity webkitTextSizeAdjust webkitTextStroke webkitTextStrokeColor webkitTextStrokeWidth webkitTransform webkitTransformOrigin webkitTransformOriginX webkitTransformOriginY webkitTransformOriginZ webkitTransformStyle webkitTransition webkitTransitionDelay webkitTransitionDuration webkitTransitionProperty webkitTransitionTimingFunction webkitUserDrag webkitUserModify webkitUserSelect webkitWritingMode whiteSpace widows width willChange wordBreak wordSpacing wordWrap writingMode x y zIndex zoom`.split(" ");

	// daftar aturan penamaan kelas dan property nya
	const allRule = {};

	// mengambil aturan penamaan
	const rule = cssMatch.filter(e =>{

		if(allRule[[...e.match(/([A-Z])/gm) || []].length+1] instanceof Array){

			allRule[[...e.match(/([A-Z])/gm) || []].length+1].push({
				propertyName: e,
				css: e.replace(/[A-Z]/gm,"-$&").toLowerCase()
			});

		}
		else{

			allRule[[...e.match(/([A-Z])/gm) || []].length+1] = [];

		}

	});

	// melakukan pembuatan class
	const result = allRule[dataSplited.child.length-1]?.filter(e => e.css === dataSplited.copyOfPureClass);
	
	if(result){

		const uid = uuidv4();
		let cssTemplate = "";
		if(result.length > 0) cssTemplate = `
			.${dataSplited.fullClassName.replace(/\[.*?\]/igm,uid).replace(/(^\"|\"$|(\w.*:))/igm,"")}{

				${dataSplited.copyOfPureClass} : ${dataSplited.value.replace(/(\[|\])/igm,"")};

			}
		`;

		return {
			nameBefore: dataSplited.fullClassName,
			nameAfter: dataSplited.fullClassName.replace(/\[.*?\]/igm,uid).replace(/(^\"|\"$|(\w.*:))/igm,""),
			template: cssTemplate,
			mediaQuery: dataSplited.mediaQuery,
			value: dataSplited.value,
			parentName: dataSplited.parentName,
			updateTemplate(className = "",value = ""){

				this.nameAfter = className;
				this.template = `
					.${className.replace(/\[.*?\]/igm,uid).replace(/(^\"|\"$)/igm,"")}{

						${dataSplited.copyOfPureClass} : ${value.replace(/(\[|\])/igm,"")};

					}
				`;

			}
		}


	};

}

const copase = {
	splitValue,
	checkValue
}

module.exports = copase;