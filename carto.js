
function Surligner(svg_id) { 
	var el = window.carteSVG.getElementById(svg_id); 
	el.setAttribute("survol","oui"); 
	setTimeout(function() {
		el.removeAttribute("survol");  
	}, 1000);
} 

function elContenu_tabuler(entetes,valeurs) { 
	var table = document.createElement("table"); 
	var thead = document.createElement("thead"); 
	var thead_tr = document.createElement("tr"); 
	var tbody = document.createElement("tbody"); 
	for (var i=0; i<entetes.length; i++) { 
		var _td = document.createElement("td"); 
		_td.innerHTML = entetes[i]; 
		thead_tr.appendChild(_td); 
	} 
	for (var i=0; i<valeurs.length; i++) { 
		var _tr = document.createElement("tr"); 
		for (var y=0; y<valeurs[i].length; y++) { 
			var v = valeurs[i][y]; 
			var _td = document.createElement("td"); 
			if (typeof(v)=="string") { 
				_td.innerHTML = "(texte: "+v+")"; 
			} else if (typeof(v)=="boolean") { 
				_td.innerHTML = (v)?"(bool:1)":"(bool:0)"; 
			} else if (typeof(v)=="function") { 
				_td.innerHTML = "(fonction)"; 
			} else { 
				try {  
					var tmp = []; 
					for (_v of v.entries()) { 
						tmp.push(_v.value.join(":"));
					}
					_td.innerHTML = "(tableau:{ "+tmp.join("; ")+" })";
				}catch(e) { 
					_td.innerHTML = "(objet)"; 
				}
			}
			_tr.appendChild(_td); 
		} 
		tbody.appendChild(_tr); 
	} 
	thead.appendChild(thead_tr); 
	table.appendChild(thead); 
	table.appendChild(tbody); 
	return table; 
} 

function Carte_charger() { 
	window.carteSVG = document.getElementById("carteSVG").contentDocument; 
	var els = window.carteSVG.getElementsByTagName("polygon"); 
	for (var i=0; i<els.length; i++) { 
		els[i].addEventListener( 
			"click", 
			window.Actions["afficher"] 
		); 
		els[i].addEventListener( 
			"mouseover", 
			function(evt) { 
				Surligner(evt.target.id); 
			} 
		); 
	} 
	var els = window.carteSVG.getElementsByTagName("path"); 
	for (var i=0; i<els.length; i++) { 
		els[i].addEventListener("click", window.el_details); 
	} 
}
/*--- --- ---*/ 

/*--- Rechercher d'un élément dans le DOM du SVG ---*/ 
window.Actions["aider"] = function(evt) { 
	elContenu_nettoyer(null,"aider"); 
	var p = document.createElement("p"); 
	p.innerHTML = "Chaque bouton du menu fait référence \
	à une action qui peut être utilisée dans plusieurs contextes\
	différents.\n\nOutils, scripts et mise en place tous droits \
	réservés Julien Garderon, mai 2017.".traduireLignes(); 
	window.elContenu.appendChild( 
		window.Routines["fieldset_creer"]( 
			"Comprendre cette aide...", 
			p  
		) 
	); 
	var els = document.getElementById("menu").getElementsByTagName("li"); 
	for(var i=0; i<els.length; i++) { 
		var action = els[i].getAttribute("action"); 
		if (window.Actions[action]!=undefined) { 
			var fct = window.Actions[action].toString(); 
			var r = fct.match(/":aide:\s([^\"]+)"/); 
			if (r!=null) { 
				var div = document.createElement("div"); 
				var p = document.createElement("p"); 
				p.innerHTML = "&rarr; Action:"+action; 
				div.appendChild(p); 
				var p = document.createElement("p"); 
				p.innerHTML = r[1].bbCode(); 
				div.appendChild(p); 
				var el_fld = window.Routines["fieldset_creer"]( 
					"&laquo; "+els[i].innerHTML+" &raquo;", 
					div 
				); 
				window.elContenu.appendChild( 
					el_fld 
				); 
			} 
		} 
	} 
};
/*--- --- ---*/ 

/*--- Rechercher d'un élément dans le DOM du SVG ---*/ 
window.Actions["chercher"] = function(evt) { 
	":aide: \
	Un formulaire vous permet de rechercher des \
	éléments en fonction du tag de l'élément voulu \
	et éventuellement de son ID (expression régulière \
	attendue).\nLe retour est composé de la liste des \
	25 premiers éléments qui correspondent à ces \
	deux critères."; 
	elContenu_nettoyer(null,"chercher"); 
	var f = document.createElement("form"); 
	var i1 = document.createElement("input"); 
	i1.setAttribute("type", "text"); 
	i1.setAttribute("value", "polygon"); 
	i1.setAttribute("name", "i1"); 
	f.appendChild(window.Routines["fieldset_creer"]("type du noeud", i1)); 
	var i2 = document.createElement("input"); 
	i2.setAttribute("type", "text"); 
	i2.setAttribute("value", ""); 
	i2.setAttribute("name", "i2"); 
	f.appendChild(window.Routines["fieldset_creer"]("restriction par ID (expReg)", i2)); 
	var b = document.createElement("input"); 
	b.setAttribute("type", "submit"); 
	b.setAttribute("value", "chercher 1 ou n élément(s)"); 
	f.appendChild(b); 
	f.addEventListener("submit", function(evt) { 
		evt.preventDefault(); 
		var els = window.carteSVG.getElementsByTagName(
			evt.target[1].value 
		); 
		var r = []; 
		try { 
			var expReg = new RegExp(evt.target[3].value, "i"); 
			console.log(expReg); 
		} catch(e) { 
			window.Suraffichage("L'expression régulière fournie n'est pas valide.",true,true); 
			return null; 
		}
		for (var i=0; i<els.length; i++) { 
			console.log(r.length>25); 
			if (expReg.test(els[i].getAttribute("id"))) { 
				r.push(els[i]); 
				if (r.length>25)
					i = els.length; 
			} 
		} 
		if (r.length<1) { 
			var retour = document.createElement("p"); 
			retour.innerHTML = "Il n'y a pas de résultat à afficher."; 
		} else { 
			var retour = document.createElement("ul"); 
			for (var i=0; i<r.length; i++) { 
				var li = document.createElement("li"); 
				var a = document.createElement("a"); 
				a.setAttribute("href","#"+r[i].id); 
				a.innerHTML = r[i].localName+"#"+r[i].id; 
				a.addEventListener("mouseover",function(evt) { 
					evt.preventDefault(); 
					Surligner( 
						evt.target.getAttribute("href").replace("#","") 
					); 
				}); 
				a.addEventListener("click",window.Actions["afficher"]); 
				li.appendChild(a); 
				retour.appendChild(li); 
			} 
		} 
		var els = window.elContenu.getElementsByClassName("resultats"); 
		if (els.length>0) { 
			els[0].parentNode.removeChild(els[0]); 
		} 
		el_fld = window.Routines["fieldset_creer"]("Résultat(s)",retour); 
		el_fld.setAttribute("class","resultats"); 
		window.elContenu.appendChild( 
			el_fld 
		); 
	}); 
	window.elContenu.appendChild(
		window.Routines["fieldset_creer"]("Rechercher",f) 
	); 
	document.location.hash = "#contenu"; 
}; 
/*--- --- ---*/ 

/*--- Afficher un élément du DOM du SVG ---*/ 
window.Actions["afficher"] = function(evt) { 
	":aide: \
	Ce formulaire vous permet d'éditer les attributs \
	existants d'un élément."; 
	elContenu_nettoyer(null,"afficher"); 
	try { 
		try { 
			var elId = evt.target.getAttribute("href").replace("#",""); 
		} catch(e) { 
			var elId = evt.target.id; 
		} 
		var elObj = window.carteSVG.getElementById(elId); 
		var atts = elObj.attributes; 
		var atts_v = []; 
		for(var att of atts) { 
			atts_v.push([
				att.name, 
				att.value 
			]); 
		}
		var _ligne = function(tab,form=false) { 
			var tr = document.createElement("tr"); 
			for(var i=0; i<tab.length; i++) { 
				var td = document.createElement("td"); 
				if (form) { 
					var textarea = document.createElement("textarea"); 
					textarea.setAttribute("v_precedente",tab[i]); 
					textarea.value = tab[i]; 
					td.appendChild(textarea); 
				} else { 
					td.innerHTML = tab[i]; 
				}
				tr.appendChild(td); 
			} 
			return tr; 
		}; 
		var tableau = document.createElement("table"); 
		var thead = document.createElement("thead"); 
		thead.appendChild(_ligne( 
			[ 
				"Attribut (nom)", 
				"Propriétée associée" 
			], 
			false 
		)); 
		tableau.appendChild(thead); 
		var tbody = document.createElement("tbody"); 
		for (var i=0; i<atts_v.length; i++) { 
			tbody.appendChild(_ligne( 
				atts_v[i], 
				true 
			)); 
		} 
		tableau.appendChild(tbody); 
		var form = document.createElement("form"); 
		form.addEventListener( 
			"submit", 
			function(evt) { 
				evt.preventDefault(); 
				var elId = evt.target.getElementsByTagName("input")[0].value; 
				var lignes = evt.target.getElementsByTagName("tbody")[0].getElementsByTagName("tr"); 
				for(var i=0; i<lignes.length; i++) { 
					var ligne = lignes[i]; 
					var champs = ligne.getElementsByTagName("textarea"); 
					if (
						champs[0].value==champs[0].getAttribute("v_precedente") 
						|| 
						champs[1].value==champs[1].getAttribute("v_precedente") 
					) { 
						try { 
							var elObj = window.carteSVG.getElementById(elId); 
							elObj.removeAttribute(champs[1].getAttribute("v_precedente")); 
							elObj.setAttribute(champs[0].value, champs[1].value); 
						} catch(e) { 
							console.log("err 1 "+e); 
						}
					}
				} 
			} 
		); 
		form.appendChild(tableau); 
		var i2 = document.createElement("input"); 
		i2.setAttribute("type","hidden"); 
		i2.setAttribute("value",elId); 
		form.appendChild(i2); 
		var i1 = document.createElement("input"); 
		i1.setAttribute("type","submit"); 
		form.appendChild(i1); 
		window.elContenu.appendChild( 
			window.Routines["fieldset_creer"]( 
				"Element SVG "+elObj.localName+"#"+elId, 
				form 
			)
		); 
		
	} catch(e) { 
		Suraffichage("Impossible d'examiner l'élément : "+e,true,true); 
	} 
	document.location.hash = "#contenu"; 
} 
/*--- --- ---*/ 

/*--- Afficher un élément du DOM du SVG ---*/ 
window.Actions["parser"] = function(evt) {  
	":aide: \
	Ce formulaire permet de copier-coller les données CSV pour le\
	 parsage vers JS. La première ligne est systématiquement \
	 considérée comme l'entête.\nDeux possibilités :\n\
	- soit vers le contenu (une colonne 'id' est nécessaire \
	suivi immédiatement par la colonne de la valeur numérique \
	au format texte),\n\
	- soit vers le bornage des valeurs possibles."; 
	elContenu_nettoyer(null,"parser"); 
	var _data = (evt.target.getAttribute("type")=="bornage")?window.CSV_bornage:window.CSV_contenu; 
	var _typeData = (evt.target.getAttribute("type")=="bornage")?"bornage":"contenu"; 
	var f = document.createElement("form"); 
	var i1 = document.createElement("textarea"); 
	i1.setAttribute("value", ""); 
	i1.setAttribute("name", "i1"); 
	i1.setAttribute("rows", "1"); 
	i1.addEventListener( 
		"keyup", 
		window.Routines["textarea_lignes"]
	); 
	f.appendChild(
		window.Routines["fieldset_creer"]("contenu CSV valide '"+_typeData+"'", i1) 
	); 
	var b = document.createElement("input"); 
	b.setAttribute("type", "submit"); 
	b.setAttribute("value", "parser et enregistrer"); 
	f.appendChild(b); 
	var r = []; 
	f.addEventListener("submit", function(evt) { 
		elContenu_nettoyer(); 
		evt.preventDefault(); 
		var chaines = evt.target.i1.value.split("\n"); 
		_data["_rappel"] = function() { 
			try { 
				_data["entetes"] = _data["donnees"].shift(); 
				var m = "Toutes les données '"+_typeData+"' ont été parsées !"; 
			} catch(e) { 
				var m = "Une erreur est survenue : "+e; 
			}
			elContenu_nettoyer(); 
			var p = document.createElement("p"); 
			p.innerHTML = m; 
			window.elContenu.appendChild( 
				window.Routines["fieldset_creer"]("Parseur des données",p) 
			); 
		}; 
		var W = new Worker("./csv.worker.js"); 
		W.onerror = function(e) { 
			Suraffichage("Erreur du parseur CSV !",true,true); 
		}; 
		W.onmessage = function(e) { 
			if (e.data==false) { 
				_data["_rappel"](); 
			} else { 
				if (e.data[0]) { 
					_data["donnees"].push(e.data[1]); 
				} else { 
					Suraffichage("Parseur CSV :"+e.data[1],true,true); 
				} 
			} 
		}; 
		for(var i=0; i<chaines.length; i++) { 
			if (chaines[i].length>0) 
				W.postMessage(chaines[i]); 
		} 
		W.postMessage(false); 
		_data["_worker"] = W; 
		var p = document.createElement("p"); 
		p.innerHTML = "Les travailleurs CSV '"+_typeData+"' sont en cours de travaux..."; 
		window.elContenu.appendChild( 
			window.Routines["fieldset_creer"]("Parseur des données '"+_typeData+"'",p) 
		); 
	}); 
	window.elContenu.appendChild( 
		window.Routines["fieldset_creer"]("Parseur des données",f ) 
	);  
	document.location.hash = "#contenu"; 
} 
/*--- --- ---*/ 

/*--- Afficher un élément du DOM du SVG ---*/ 
window.Actions["voir"] = function(evt) { 
	":aide: \
	La liste de l'ensemble des données enregistrées soit \
	pour le contenu, soit pour le bornage. L'édition n'est \
	pas possible (vous pouvez écraser les valeurs par un \
	nouveau parsage)."; 
	elContenu_nettoyer(null,"voir"); 
	var _data = (evt.target.getAttribute("type")=="bornage")?window.CSV_bornage:window.CSV_contenu; 
	var _typeData = (evt.target.getAttribute("type")=="bornage")?"bornage":"contenu"; 
	if (window.CSV_contenu["donnees"].length<1) { 
		var p = document.createElement("p"); 
		p.innerHTML = "Aucun élément CSV valide de '"+_typeData+"' n'est enregistré."; 
		window.elContenu.appendChild( 
			p 
		); 
	} else { 
		var _ligne = function(tab) { 
			var tr = document.createElement("tr"); 
			for(var i=0; i<tab.length; i++) { 
				var td = document.createElement("td"); 
				td.innerHTML = tab[i]; 
				tr.appendChild(td); 
			} 
			return tr; 
		}; 
		var tableau = document.createElement("table"); 
		var thead = document.createElement("thead"); 
		thead.appendChild(_ligne(_data["entetes"])); 
		tableau.appendChild(thead); 
		var tbody = document.createElement("tbody"); 
		for (var i=0; i<_data["donnees"].length; i++) { 
			tbody.appendChild(_ligne(_data["donnees"][i])); 
		} 
		tableau.appendChild(tbody); 
		var h1 = document.createElement("h1"); 
		h1.innerHTML = "Données CSV de "+_typeData; 
		window.elContenu.appendChild( 
			h1 
		); 
		window.elContenu.appendChild( 
			tableau 
		); 
	}  
	document.location.hash = "#contenu"; 
}; 
/*--- --- ---*/ 

/*--- Coloriser les éléments par ID du SVG ---*/ 
window.Actions["coloriser"] = function(evt) { 
	":aide: \
	Cette action généra les modifications d'attributes \
	des éléments SVG de la carte, à partir des données \
	disponible. La colorisation est assurée par les \
	sélecteurs CSS."; 
	elContenu_nettoyer(null,"coloriser"); 
	var formulaire = document.createElement("form");  
	var label = document.createElement("label"); 
	label.innerHTML = "Attribut 'valeur'"; 
	var input = document.createElement("input"); 
	input.setAttribute("type","text"); 
	input.setAttribute("name","nomAttr1"); 
	input.setAttribute("value","valeur"); 
	label.appendChild(input); 
	formulaire.appendChild(label); 
	var label = document.createElement("label"); 
	input.setAttribute("type","text"); 
	label.innerHTML = "Attribut 'borne'"; 
	var input = document.createElement("input"); 
	input.setAttribute("name","nomAttr2"); 
	input.setAttribute("value","borne"); 
	label.appendChild(input); 
	formulaire.appendChild(label); 
	var input = document.createElement("input"); 
	input.setAttribute("type","submit"); 
	input.setAttribute("value","lancer la colorisation"); 
	label.appendChild(input); 
	formulaire.appendChild(label); 
	formulaire.addEventListener( 
		"submit", 
		function(evt) { 
			evt.preventDefault(); 
			var borne = function(t) { 
				try { 
					t = parseFloat(t); 
				} catch(e) { 
					return false; 
				} 
				for (var i=0; i<window.CSV_bornage["donnees"].length; i++) { 
					var b = window.CSV_bornage["donnees"][i]; 
					if (t>=b[0] && t<=b[1]) 
						return b[2]; 
				} 
				return null; 
			}; 
			var colId = null; 
			for(var i=0; i<window.CSV_contenu["entetes"].length; i++) { 
				if (window.CSV_contenu["entetes"][i]=="id") {
					colId = i; 
				} 
			} 
			console.log(colId); 
			if (colId==null) { 
				var p = document.createElement("p"); 
				p.innerHTML = "Vous devez disposer d'une colonne 'id' dans les entêtes, correspondant aux ID des éléments SVG."; 
				window.elContenu.appendChild( 
					p 
				); 
			} else { 
				r = []; 
				for(var i=0; i<window.CSV_contenu["donnees"].length; i++) { 
					var v = window.CSV_contenu["donnees"][i]; 
					try { 
						var b = borne(v[colId+1]); 
						console.log(b); 
						if (b!=false) { 
							window.carteSVG.getElementById(v[colId]).setAttribute(
								evt.target.nomAttr1.value, 
								v[colId+1] 
							); 
							window.carteSVG.getElementById(v[colId]).setAttribute( 
								evt.target.nomAttr2.value, 
								b 
							); 
						} else { 
							r.push([i,colId,v[colId+1]]); 
						}
					} catch(e) { 
						r.push([i,vId,e]); 
					} 
				} 
				var p = document.createElement("p"); 
				p.innerHTML = "La colorisation est terminée. S'il y a des erreurs, elles sont disponibles dans <i>console.log</i>."; 
				if (r.length>0) 
					console.log(r); 
				elContenu_nettoyer(null,"coloriser"); 
				window.elContenu.appendChild( 
					p 
				); 
			} 
		}
	)
	window.elContenu.appendChild( 
		window.Routines["fieldset_creer"]( 
			"Définir le nom des attibuts des éléments ajoutés", 
			formulaire   
		) 
	); 
	document.location.hash = "#contenu"; 
}; 
/*--- --- ---*/ 

/*--- Editer le CSS du SVG ---*/ 
window.Actions["editer"] = function(evt) { 
	":aide: \
	Ce formulaire vous permettra d'éditer la \
	première feuille de style de la carte SVG \
	(au sein d'une cdata-section)."; 
	elContenu_nettoyer(null,"editer"); 
	try { 
		var styleCSS = window.carteSVG.getElementsByTagName("style")[0]; 
		var form = document.createElement("form"); 
		form.addEventListener( 
			"submit", 
			function(evt) { 
			} 
		); 
		var i1 = document.createElement("textarea"); 
		var _c = ""; 
		for(var i=0; i<styleCSS.childNodes.length; i++) { 
			if (styleCSS.childNodes[i].nodeName=="#cdata-section") { 
				_c = styleCSS.childNodes[i].data; 
				break; 
			} 
		}
		i1.setAttribute( 
			"rows", 
			_c.split("\n").length+1 
		); 
		var v = _c; 
		while(v.search("\n\n")!=-1) { 
			v = v.replace("\n\n","\n"); 
		} 
		i1.value = v.strip(); 
		i1.addEventListener( 
			"keyup", 
			window.Routines["textarea_lignes"] 
		); 
		form.appendChild(i1); 
		var i2 = document.createElement("input"); 
		i2.setAttribute("type","submit"); 
		i2.setAttribute("value","Générer élément style"); 
		form.addEventListener( 
			"submit", 
			function(evt) { 
				evt.preventDefault(); 
				var styleCSS = window.carteSVG.createElementNS( 
					"http://www.w3.org/2000/svg", 
					"style" 
				); 
				styleCSS.setAttribute("type", "text/css"); 
				var cdata = window.carteSVG.createCDATASection(evt.target[0].value); 
				styleCSS.appendChild(cdata); 
				var exstyleCSS = window.carteSVG.getElementsByTagName("style")[0]; 
				exstyleCSS.parentNode.replaceChild(styleCSS,exstyleCSS); 
				alert("CSS édité !"); 
			}
		); 
		form.appendChild(i2); 
		window.elContenu.appendChild(
			window.Routines["fieldset_creer"]("Editer CSS du SVG", form)
		); 
	} catch(e) { 
		var p = document.createElement("p"); 
		p.innerHTML = "Une erreur est survenue lors de l'édition : "+e; 
		window.elContenu.appendChild( 
			window.Routines["fieldset_creer"]("CSS du SVG",p) 
		); 
	} 
	document.location.hash = "#contenu"; 
} 
/*--- --- ---*/ 

/*--- Afficher un élément du DOM du SVG ---*/ 
window.Actions["actionner"] = function(evt) { 
	":aide: \
	Ce formulaire permet l'exécution d'une fonction \
	anonyme, générée par le code fourni. Seules les \
	variables globales sont disponibles.\n l'argument \
	'elR', passée en paramêtre lors de l'exécution de \
	cette fonction anonyme, est l'élément HTML déterminé \
	pour la sortie textuelle."; 
	elContenu_nettoyer(null,"actionner"); 
	var form = document.createElement("form"); 
	form.addEventListener( 
		"submit", 
		function(evt) { 
			evt.preventDefault(); 
			var r = document.getElementById("contenu").getElementsByClassName("resultats")[0]; 
			var fct = evt.target[0].value; 
			if (fct=="") {
				r.innerHTML = "La fonction ne peut pas être vide..."; 
			} else { 
				var f = new Function( 
					"elR", 
					
				); 
				try { 
					console.log(f(r)); 
				} catch(e) { 
					r.innerHTML = "Une erreur est survenue lors de la réalisation de la fonction : <br /><b>"+e+"</b>"; 
				} 
			} 
		} 
	); 
	var i1 = document.createElement("textarea"); 
	i1.setAttribute("rows", "1"); 
	i1.addEventListener( 
		"keyup", 
		window.Routines["textarea_lignes"] 
	); 
	form.appendChild(i1); 
	var i2 = document.createElement("input"); 
	i2.setAttribute("type","submit"); 
	form.appendChild(i2); 
	window.elContenu.appendChild( 
		window.Routines["fieldset_creer"]("Réalisation d'une fonction",form) 
	); 
	var div = document.createElement("div"); 
	div.setAttribute("class","resultats"); 
	window.elContenu.appendChild( 
		window.Routines["fieldset_creer"]("Résultat de la fonction", div)
	); 
	document.location.hash = "#contenu"; 
}; 
/*--- --- ---*/ 

/*--- Afficher un élément du DOM du SVG ---*/ 
window.Actions["exporter"] = function(evt) { 
	":aide: \
	/!\ Attention, cette fonction peut prendre un \
	certain temps et peut bloquer temporairement \
	l'affichage de la page. La génération sera rendu \
	sous la forme du texte source du SVG."; 
	elContenu_nettoyer(null,"exporter"); 
	var p = document.createElement("p"); 
	p.innerHTML = "Traitement du SVG en cours ; merci de votre patience..."; 
	window.elContenu.appendChild( 
		p 
	); 
	try { 
		var tmp = new XMLSerializer().serializeToString(
			window.carteSVG 
		); 
		tmp = tmp.split("\n"); 
		y = 1; 
		var eR = /^(\s*)$/;
		for(var i=0; i<y; i++) { 
			if (eR.test(tmp[i])) { 
				tmp.splice(i,1); 
				i--; 
			}
			y = tmp.length; 
		} 
		var textarea = document.createElement("textarea"); 
		textarea.value = tmp.join("\n"); 
		textarea.setAttribute( 
			"rows",
			(tmp.length>24)?25:tmp.length 
		); 
		elContenu_nettoyer(null,"exporter"); 
		window.elContenu.appendChild( 
			window.Routines["fieldset_creer"]( 
				"Export du contenu SVG", 
				textarea 
			) 
		); 
		Suraffichage(null); 
	} catch(e) { 
		Suraffichage("Traitement du SVG : "+e, true,true); 
	} 
	document.location.hash = "#contenu"; 
};  
/*--- --- ---*/ 

/*--- Charger de carte SVG ---*/ 
window.Actions["choisir"] = function(evt) { 
	":aide: \
	Il s'agit de la liste des cartes disponibles."; 
	elContenu_nettoyer(null,"choisir"); 
	var ul = document.createElement("ul"); 
	for(var c of window.Cartes) { 
		var li = document.createElement("li"); 
		li.innerHTML = c["carteNom"]+" : "; 
		var a = document.createElement("a"); 
		a.innerHTML = "carte#"+c["carteId"]; 
		a.setAttribute("href","./#carte:"+c["carteId"]); 
		a.setAttribute("carteId",c["carteId"]); 
		a.addEventListener( 
			"click", 
			function(evt) { 
				evt.preventDefault(); 
				try { 
					var carte = {}; 
					var cId = evt.target.getAttribute("carteId"); 
					for(var c of window.Cartes) { 
						if (c["carteId"]==cId) {
							carte = c; 
							break; 
						}
					} 
					var nvCarte = document.createElement("object"); 
					nvCarte.setAttribute("data", carte["carteURL"]); 
					nvCarte.setAttribute("type", "image/svg+xml"); 
					nvCarte.setAttribute("id", "carteSVG"); 
					nvCarte.setAttribute("width", "100%"); 
					nvCarte.addEventListener( 
						"load", 
						function() { 
							Carte_charger(); 
							Suraffichage(null);   
						} 
					); 
					var exCarte = document.getElementById("carteSVG"); 
					exCarte.parentNode.replaceChild( 
						nvCarte, 
						exCarte 
					); 
					Suraffichage("Chargement de la nouvelle carte en cours...",true); 
				} catch(e) {
					Suraffichage("Changement de la carte, une erreur est survenue : "+e,true); 
				}
			} 
		); 
		li.appendChild(a); 
		ul.appendChild(li); 
	} 
	window.elContenu.appendChild( 
		window.Routines["fieldset_creer"]( 
			"Listes des cartes SVG disponibles", 
			ul 
		) 
	); 
	document.location.hash = "#contenu"; 
} 

window.Regions = null; 
window.CSV_contenu = { 
	"entetes": [], 
	"donnees": [], 
	"_worker": null, 
	"_rappel": function() {} 
}; 
window.CSV_bornage = { 
	"entetes": [], 
	"donnees": [], 
	"_worker": null, 
	"_rappel": function() {} 
}; 

window.addEventListener("load", function() { 
	
	Carte_charger(); 

	chargement( 
		"./infos.json", 
		function(obj) {
			window.Regions = JSON.parse(obj.responseText); 
		}
	); 
	
	chargement( 
		"./couleurs.json", 
		function(obj) {
			window.Couleurs = JSON.parse(obj.responseText); 
		}
	); 
	
	chargement( 
		"./cartes.json", 
		function(obj) {
			window.Cartes = JSON.parse(obj.responseText); 
		}
	); 
	
}); 
