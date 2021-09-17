Array.from(document.querySelectorAll("input[type='checkbox']")).forEach(checkbox => {
    let privacySettingName = checkbox.id;
    checkbox.addEventListener('click' , async () => {
        try{
            await fetch(`/customer/changeSetting/${privacySettingName}/${checkbox.checked}`);
        }
        catch(fetcherror){
            console.error(fetcherror);
        }
    });
});

document.querySelector('#PrivacyTab').classList.add('selectedTab');

document.querySelector("#theme").addEventListener('click' , async (e) => {
    let button = document.querySelector('#theme');
    if(button.checked === false) {
        document.body.classList.add('dark');
        let f = await fetch("/customer/changeTheme/Dark");
        f = await f.json();
    }
    else{
        document.body.classList.remove('dark');
        let f = await fetch("/customer/changeTheme/Light");
        f = await f.json();
    }
});
