
function CSV_chaine(chaine) { 
	var r = []; 
	var en_cours = ""; 
	var ouvert = false; 
	for(var i=0; i<chaine.length; i++) { 
		var maillon = chaine.charAt(i); 
		switch(maillon) { 
			case '"': 
				if (chaine.charAt(i-1)=="\\") {
					en_cours += maillon 
				} else { 
					if (ouvert) { 
						r.push(en_cours); 
						en_cours = ""; 
					} 
					ouvert = (ouvert)?false:true; 
				} 
				break; 
			case ";": 
				if (ouvert) 
					en_cours += maillon; 
				break; 
			default: 
				if (ouvert) { 
					en_cours += maillon; 
				} else { 
					throw "le CSV est invalide (caractère invalide)."; 
				} 
				break; 
		} 
	} 
	if (ouvert) 
		throw "le CSV est invalide (chaine toujours ouverte)."; 
	return r; 
}

onmessage = function(evt) { 
	if (evt.data==false) {
		postMessage(false); 
	} else { 
		try { 
			postMessage([true,CSV_chaine(evt.data)]); 
		} catch(e) { 
			postMessage([false,e]); 
		} 
	} 
} 