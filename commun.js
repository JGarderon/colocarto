if(typeof(String.prototype.strip) === "undefined")
{
    String.prototype.strip = function() 
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
} 
if(typeof(String.prototype.traduireLignes) === "undefined")
{
    String.prototype.traduireLignes = function() 
    {
        return String(this).split("\n").join("<br />");
    };
} 
if(typeof(String.prototype.bbCode) === "undefined")
{
    String.prototype.bbCode = function() 
    { 
    	return String(this).replace(
    		/(\\\r\n|\\\r|\\\n)/g, 
    		"" 
    	).replace(
    		/(\t)/g, 
    		"" 
    	).replace(
    		/\\n/g, 
    		"<br />" 
    	); 
    };
} 









window.Actions = {}; 

window.Routines = {}; 
window.Routines["textarea_lignes"] = function(evt) { 
	evt.target.setAttribute( 
		"rows", 
		evt.target.value.split("\n").length+1 
	); 
} 
window.Routines["fieldset_creer"] = function(titre, enfant=null) { 
	var el = document.createElement("fieldset"); 
	var el_legend = document.createElement("legend"); 
	el_legend.innerHTML = titre; 
	el.appendChild(el_legend); 
	try { 
		el.appendChild(enfant); 	
	} catch(e) {} 
	return el; 
} 

window.chargements = []; 
function chargement(URL,FctRappel) { 
	window.Suraffichage("Début du chargement des données JSON<br /> (URL = "+URL+")",true); 
	
	tmp = new XMLHttpRequest(); 
	tmp.FctRappel = FctRappel 
	tmp.onprogress = function(evt) { 
		if (evt.lengthComputable) { 
			window.Suraffichage("Téléchargement JSON : "+(Math.round((evt.loaded / evt.total)*100)).toString()+"%",true); 
		} else { 
			window.Suraffichage("Téléchargement en cours, d'une taille inconnue !",true,true); 
		} 
	} 
	tmp.onreadystatechange = function(evt) { 
		if (this.readyState === XMLHttpRequest.DONE) { 
			if (this.status === 200) { 
				window.Suraffichage(null); 
				setTimeout( 
					this.FctRappel, 
					1, 
					this 
				); 
			} else {
				window.Suraffichage("Erreur lors de la récupération des données JSON : "+this.statusText,true,true); 
				console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
			} 
		} 
	} 
	tmp.open('GET', URL, true);
	tmp.send(null); 
	window.chargements.push(tmp); 
} 

function elContenu_nettoyer(obj=null,contexte=null) { 
	if (obj==null) 
		obj = window.elContenu; 
	while (obj.firstChild) {
		obj.removeChild(obj.firstChild);
	} 
	if (contexte!=null) 
		obj.setAttribute("contexte",contexte); 
} 
window.addEventListener("load", function() { 
	window.elContenu = document.getElementById("contenu"); 
}); 

window.Suraffichage = function( 
	message=null, 
	etat=true, 
	type_err=false 
) { 
	var fld = function(m) { 
		var _fld = document.createElement("fieldset"); 
		var l = document.createElement("legend"); 
		l.innerHTML = "fermer la fenêtre"; 
		l.addEventListener("click", function() { 
			window.Suraffichage("",false); 
		}); 
		_fld.appendChild(l); 
		var p = document.createElement("p"); 
		p.innerHTML = m; 
		_fld.appendChild(p); 
		return _fld; 
	} 
	var etat = (etat==true)?true:false; 
	var type_err = (type_err==true)?true:false; 
	if (etat || type_err) { 
		window.Suraffichage_element[0].style.display = "flex"; 
		window.Suraffichage_element[0].setAttribute( 
			"subrillance_type", 
			(type_err)?"erreur":"normal" 
		); 
	} else { 
		window.Suraffichage_element[0].style.display = "none";
	} 
	if (message!=null) { 
		elContenu_nettoyer(window.Suraffichage_element[1]); 
		var div = document.createElement("div"); 
		div.innerHTML = message; 
		window.Suraffichage_element[1].appendChild(div); 
		//window.Suraffichage_element[1].appendChild(fld(message)); 
	} else { 
		window.Suraffichage_element[0].style.display = "none"; 
	}
}  
window.addEventListener("load", function() { 
	
	window.Suraffichage_element = document.getElementById("suraffichage"); 
	window.Suraffichage_element = [ 
		window.Suraffichage_element, 
		window.Suraffichage_element.getElementsByTagName("span")[0]
	]; 
}); 

window.addEventListener("load", function() { 
	var els = document.getElementById("menu").getElementsByTagName("li"); 
	for(var i=0; i<els.length; i++) { 
		var action = els[i].getAttribute("action"); 
		if (window.Actions[action]!=undefined) 
				els[i].addEventListener( 
					"click", 
					window.Actions[action] 
				); 

	} 
}); 




