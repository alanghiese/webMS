export class Encode {

	constructor(){}

	utf8_to_b64( str ) {
	  return window.btoa(unescape(encodeURIComponent( str )));
	}

	b64_to_utf8( str ) {
	  return decodeURIComponent(escape(window.atob( str )));
	}




}

