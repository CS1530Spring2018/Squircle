function setup() {
	$("#genLobbyCode").on("click", function() {
		//$(window).load("/lobbycode/");
		var req = new XMLHttpRequest(); 
		req.open("GET", "/lobbycode/");
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.onreadystatechange = function() {
			if (req.readyState == 4) 
			{
				if (req.status != 200) 
				{
					
				} else {
					window.location.replace(req.responseText);
				}
			}
		}
		
		req.send();
		console.log("created lobby");
	});
}
window.addEventListener("load", setup, true);