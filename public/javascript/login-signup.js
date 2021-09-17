const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
	document.querySelector("#developer-secondary-info").style.display = "none";
	document.querySelector('#bio').style.display = "none";
});

function check() {
	if (sessionStorage.getItem("action") == "login") {
		container.classList.remove("right-panel-active");
	} else if (sessionStorage.getItem("action") == "signup") {
		container.classList.add("right-panel-active");
	} else {
		container.classList.remove("right-panel-active");
	}
}

document.querySelector('#signUpButton').addEventListener('click', DataValidation);

async function DataValidation(e) {
	e.preventDefault();
	let singUpFormInputValues = GetInputValues();
	if (singUpFormInputValues[2] === "" || singUpFormInputValues[3] === "" || singUpFormInputValues[4] === "" || singUpFormInputValues[6] === "") {
		document.body.insertAdjacentHTML('beforeend', `
			<section class="error error-show" id="requiredValuesrequired"> 
				Username,password,email and role are required fields.
			</section>
		`)
		setTimeout(() => {
			document.querySelector('#requiredValuesrequired').remove();
		}, 3000)
	} else {
		DecideSignUpPath(singUpFormInputValues);
	}
}

function GetInputValues() {
	let values = [];
	values.push(document.querySelector("#name").value);
	values.push(document.querySelector("#surname").value);
	values.push(document.querySelector("#username").value);
	values.push(document.querySelector("#password").value);
	values.push(document.querySelector("#email").value);
	values.push(document.querySelector("#dateofbirth").value);
	values.push(document.querySelector("#role").value);
	values.push(document.querySelector("#gender").value);
	values.push(document.querySelector("#bio").value);
	values.push(document.querySelector("#profileImage").value);
	return values;
}

async function DecideSignUpPath(singUpFormInputValues) {
	switch (document.querySelector('#role').value) {
		case "developer":
			try {
				let data1 = {
					email: singUpFormInputValues[4],
					username: singUpFormInputValues[2],
					password: singUpFormInputValues[3],
					role: singUpFormInputValues[6],
					name: singUpFormInputValues[0],
					surname: singUpFormInputValues[1],
					gender: singUpFormInputValues[7],
					dateofbirth: singUpFormInputValues[5],
					profileImage: singUpFormInputValues[9],
					predefinedTags: GetPredefinedTags(),
					customTags: document.querySelector("#custom_tags").value,
					cvName: document.querySelector('#cv').value,
					developerLinks: GetLinks()
				}

				const uploadOptions = {
					method: 'POST',
					body: new FormData(document.signupForm)
				}
				let optionsJSON1 = {
					method: "POST",
					body: JSON.stringify(data1),
					headers: {
						'Content-Type': 'application/json'
					}
				}

				let checkExistenceFetch = await fetch("/developer/checkExistence", optionsJSON1);
				let checkExistenceResponse = await checkExistenceFetch.json();
				if (checkExistenceResponse.message !== "success") {
					console.error(checkExistenceResponse)
					ShowErrorDuringRegistration(checkExistenceResponse);
					return;
				}
				let uploadImageFetch = await fetch('/developer/uploadImage', uploadOptions);
				let uploadImageResponse = await uploadImageFetch.json();
				if (uploadImageResponse.message !== "success") {
					console.error(uploadImageResponse)
					ShowErrorDuringRegistration(uploadImageResponse);
					return;
				}

				uploadOptions.body = new FormData(document.developerSecondaryInfo);

				let uploadCVfetch = await fetch('/developer/uploadCV', uploadOptions);
				let uploadCVresponse = await uploadCVfetch.json();
				if (uploadCVresponse.message !== "success") {
					console.error(uploadCVresponse)
					ShowErrorDuringRegistration(uploadCVresponse);
					return;
				}
				data1.profileImage = uploadImageResponse.imageName;
				data1.cvName = uploadCVresponse.cvName;
				optionsJSON1.body = JSON.stringify(data1);
				let registerUserFetch = await fetch("/developer/signup", optionsJSON1);
				let registerUserResponse = await registerUserFetch.json();
				if (registerUserResponse.message !== "success") {
					ShowErrorDuringRegistration(registerUserResponse);
					return;
				}
				window.location.href = "/developer/loggedIn";
			} catch (error) {
				console.error(error);
			}
			break;
		case "customer":
			let data = {
				email: singUpFormInputValues[4],
				username: singUpFormInputValues[2],
				password: singUpFormInputValues[3],
				role: singUpFormInputValues[6],
				name: singUpFormInputValues[0],
				surname: singUpFormInputValues[1],
				gender: singUpFormInputValues[7],
				dateofbirth: singUpFormInputValues[5],
				bio: singUpFormInputValues[8],
				profileImage: singUpFormInputValues[9]
			}

			const optionsMultiPart = {
				method: 'POST',
				body: new FormData(document.signupForm),
			}

			let optionsJSON = {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					'Content-Type': 'application/json'
				}
			}

			//Step 1: Check if User Exists
			try {
				let checkExistenceFetch = await fetch("/customer/checkExistence", optionsJSON);
				let checkExistenceResponse = await checkExistenceFetch.json();
				if (checkExistenceResponse.message !== "success") {
					ShowErrorDuringRegistration(checkExistenceResponse);
					return;
				}
				//User does not exist
				//Step 2: Upload Image
				let uploadImageFetch = await fetch("/customer/uploadImage", optionsMultiPart);
				let uploadImageResponse = await uploadImageFetch.json();
				if (uploadImageResponse.message !== "success") {
					ShowErrorDuringRegistration(uploadImageResponse);
					return;
				}
				//Step 3: Get Image Name and Send final data to server in order to register the user
				data.profileImage = uploadImageResponse.imageName;
				console.log(data.profileImage);
				optionsJSON.body = JSON.stringify(data);
				let registerUserFetch = await fetch("/customer/signup", optionsJSON);
				let registerUserResponse = await registerUserFetch.json();
				if (registerUserResponse.message !== "success") {
					ShowErrorDuringRegistration(registerUserResponse);
					return;
				}
				window.location.href = "/customer/loggedIn";
			} catch (error) {
				console.log(error);
			}
	}
}

function ShowErrorDuringRegistration(obj) {
	document.body.insertAdjacentHTML('beforeend', `
						<section class="error error-show" id="userAlreadyExists">${obj.message}</section>`);
	setTimeout(() => {
		document.querySelector('#userAlreadyExists').remove();
	}, 3000);
	return;
}

document.querySelector('#signInButton').addEventListener('click', (e) => {
	e.preventDefault();
	let username = document.querySelector('#loginUsername').value;
	let password = document.querySelector('#loginPassword').value;
	if (username === "" || password === "") {
		document.querySelector("#error").classList.add('error-show');
		document.querySelector("#signInButton").classList.add('button-off');
		setTimeout(() => {
			document.querySelector("#error").classList.remove('error-show');
			document.querySelector("#signInButton").classList.remove('button-off');
		}, 3000);
	} else {
		document.loginForm.submit();
	}
});

try {
	document.querySelector('#notfound').classList.add('error-show');
	setTimeout(() => {
		document.querySelector('#notfound').classList.remove('error-show');
	}, 3000);
} catch (exception) {

}

try {
	document.querySelector('#userExists').classList.add('error-show');
	setTimeout(() => {
		document.querySelector('#userExists').classList.remove('error-show');
	}, 3000);
} catch (exception) {

}

document.querySelector('#role').addEventListener('change', (e) => {
	let select = document.querySelector('#role');
	if (select.selectedIndex === 2) {
		document.querySelector('#bio').style.display = "block";
		document.querySelector("#developer-secondary-info").style.display = "none";
	} else if (select.selectedIndex === 1) {
		document.querySelector("#developer-secondary-info").style.display = "block";
		document.querySelector('#bio').style.display = "none";
	}
});

function GetPredefinedTags() {
	let tagsInputs = Array.from(document.querySelectorAll('.tags input'));
	let tags = [];
	tagsInputs.forEach(input => {
		if (input.checked === true) {
			tags.push(input.id.split("_").join(" "));
		}
	});
	return tags.toString();
}

function GetLinks() {
	let inputs = Array.from(document.querySelectorAll('.links input'));
	let links = [];
	for (let i = 0; i < inputs.length; i += 2) {
		if (inputs[i].value !== "" && inputs[i + 1] !== "") {
			links.push({
				description: inputs[i].value,
				link: inputs[i + 1].value
			});
		}
	};
	return links;
}