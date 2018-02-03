function setup() {
	$("#genLobbyCode").on("click", function() {
		$("#lobbycode").load("/lobbycode/");
		console.log("created lobby");
	});
}
window.addEventListener("load", setup, true);