var modules=0;function addNewRowOfControls(b){var a=document.createElement("div");modules++;a.id="module-row"+modules;a.className="input-row";a.innerHTML='<input type="text" name="grade" placeholder="Module Grade"><input type="text" name="credits" placeholder="Module Credits"><input type="button" class="button-1 button-close" name="close" value="&times;" onClick="removeRow(\''+a.id+"', '"+b+"')\">";document.getElementById(b).appendChild(a)}function removeRow(b,c){var d=document.getElementById(b);var a=document.getElementById(c);a.removeChild(d)}function validateRow(b,a){if(isNaN(b)||(b<0)||(b>20)||isNaN(a)||(a<0)||(a>120)){return false}else{return true}}function updateRowData(d,b){var a=document.getElementById(d).getElementsByTagName("input");for(var c=0;c<a.length;c++){if(a[c].name!="close"){a[c].style.background=b}}}function updateRowValidData(a){updateRowData(a,"white")}function updateRowInvalidData(a){updateRowData(a,"red")}function getGradesAndCredits(e){var b=new Array();var d=0;for(var a=0;a<e.length;a++){if(e[a].nodeName=="#text"){continue}var c=new Object();var f=e[a].getElementsByTagName("input");c.grade=parseFloat(f[0].value,10);c.credits=parseFloat(f[1].value,10);c.id=e[a].id;b[d]=c;d++}return b}function validateForm(e){if(e.hasChildNodes()){var c=e.childNodes;var d=true;var b=getGradesAndCredits(c);for(var a=0;a<b.length;a++){if(!validateRow(b[a].grade,b[a].credits)){d=false;updateRowInvalidData(b[a].id)}else{updateRowValidData(b[a].id)}}if(d){return true}else{return false}}else{return false}}function CWM(c){var d=0;var a=0;for(var b=0;b<c.length;b++){d+=(c[b].grade*c[b].credits);a+=c[b].credits}return(d/a)}function CWMedian(c){c.sort(function(f,e){return(f.grade-e.grade)});var d=0;for(var b=0;b<c.length;b++){d+=c[b].credits}var a=(d+1)/2;if(isInt(a)){d=0;for(var b=0;b<c.length;b++){d+=c[b].credits;if(d>=a){return c[b].grade}}}else{d=0;for(var b=0;b<c.length;b++){d+=c[b].credits;if(((a-0.5)==d)&&((a+0.5)>d)){return((c[b+1].grade+c[b].grade)/2)}else{if(d>a){return c[b].grade}}}}}function isInt(a){if((parseFloat(a)==parseInt(a))&&!isNaN(a)){return true}else{return false}}function classificationFromGrades(a,b){if(a>=16.5){return"First Class Honours"}else{if((a>=16)&&(b>=16.5)){return"First Class Honours"}else{if(a>=13.5){return"Upper Second Class Honours (II.1)"}else{if((a>=13)&&(b>=13.5)){return"Upper Second Class Honours (II.1)"}else{if(a>=10.5){return"Lower Second Class Honours (II.2)"}else{if((a>=10)&&(b>=10.5)){return"Lower Second Class Honours (II.2)"}else{if(a>=7.5){return"Third Class Honours"}else{if((a>=7)&&(b>=7.5)){return"Third Class Honours"}else{return'a degree "Not of Honours Standard"'}}}}}}}}}function processForm(g){var f=document.getElementById(g);var e=validateForm(f);if(e){var c=getGradesAndCredits(f.childNodes);var a=CWM(c);var d=CWMedian(c);var b=classificationFromGrades(a,d);var h=document.getElementById("result");h.innerHTML="<h3>Result</h3><p>Your Credit-Weighted Mean is "+a.toFixed(2)+", and your Credit-Weighted Median is "+d.toFixed(2)+". </br> This means you will graduate with "+b+".";h.style.visibility="visible"}};