document.querySelector("#signUpLink").addEventListener('click' , () => {
    sessionStorage.setItem("action", 'signUp');
	window.location.href = "/loginPage";
});