/*
 * jQuery i18n plugin
 * @requires jQuery v1.1 or later
 *
 * See http://recursive-design.com/projects/jquery-i18n/
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Version: 0.9.1 (201012171436)
 */
(function(f){f.i18n={dict:null,setDictionary:function(a){this.dict=a},_:function(a,b){var c=a;if(this.dict&&this.dict[a])c=this.dict[a];return this.printf(c,b)},toEntity:function(a){for(var b="",c=0;c<a.length;c++)b+=a.charCodeAt(c)>128?"&#"+a.charCodeAt(c)+";":a.charAt(c);return b},stripStr:function(a){return a.replace(/^\s*/,"").replace(/\s*$/,"")},stripStrML:function(a){a=a.split("\n");for(var b=0;b<a.length;b++)a[b]=stripStr(a[b]);return stripStr(a.join(" "))},printf:function(a,b){if(!b)return a;
for(var c="",e=a.split("%s"),d=0;d<b.length;d++){if(e[d].lastIndexOf("%")==e[d].length-1&&d!=b.length-1)e[d]+="s"+e.splice(d+1,1)[0];c+=e[d]+b[d]}return c+e[e.length-1]}}})(jQuery);
