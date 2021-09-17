Array.from(document.querySelectorAll("input[type='checkbox']")).forEach(checkbox => {
    let privacySettingName = checkbox.id;
    checkbox.addEventListener('click' , async () => {
        url = `/developer/changeSetting/${privacySettingName}/${checkbox.checked}`;
        try{
            await fetch(`/developer/changeSetting/${privacySettingName}/${checkbox.checked}`);
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
        let f = await fetch("/developer/changeTheme/Dark");
        f = await f.json();
        console.log(f);
    }
    else{
        document.body.classList.remove('dark');
        let f = await fetch("/developer/changeTheme/Light");
        f = await f.json();
        console.log(f);
    }
});
