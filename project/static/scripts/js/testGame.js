//test game code
function setupCanvas() {
	// Create a <canvas> HTML tag
    canvas = document.createElement( 'canvas' );
	canvas.width = window.innerWidth;				
	canvas.height = window.innerHeight;
	
	document.body.scrollTop = 0;
	document.body.style.overflow = 'hidden'; // stackoverflow.com/questions/26745292
	
	// Get a CanvasRenderingContext2D on the canvas
	c = canvas.getContext( '2d' );
	
	// Create a <div> HTML tag called container
	container = document.createElement( 'div' );
	container.className = "container";
	
	// Put the canvas in the container
	container.appendChild(canvas);
	// Put the container on the page
	document.body.appendChild( container );
}//setupCanvas

function resetCanvas (e) {
 	// Resize the canvas - but remember - this clears the canvas too
  	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	document.body.scrollTop = 0;
	document.body.style.overflow = 'hidden'; 
	
	// Scroll to the top left.
	window.scrollTo(0,0);
}