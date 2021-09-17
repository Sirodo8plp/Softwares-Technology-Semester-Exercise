function redirectfunct(clicked){
	sessionStorage.setItem("action", clicked);
	window.location.href = "/loginPage";
}