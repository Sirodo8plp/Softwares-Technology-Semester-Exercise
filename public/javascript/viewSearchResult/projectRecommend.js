document.querySelector('#searchDev').addEventListener('input' , async (e) => {
    try {
        let projectID = document.querySelector('#projectid').value
        let filter = document.querySelector("#searchDev").value;
        let developersRequest = await fetch(`/home/marketplace/getDevelopers/${filter}`);
        let developers = await developersRequest.json();
        developers = developers.developers;
        if(developers.length === 0){
            document.querySelector("#recommendationList").innerHTML = "No users were found with this username.";
        }
        else{
            document.querySelector("#recommendationList").innerHTML = "";
            developers.forEach(developer => {
                document.querySelector("#recommendationList").insertAdjacentHTML('beforeend' , `
                    <div class="Searchprofile">
                        <figure class="searchDevFigure">
                            <img src="/images/${developer.profileImage}">
                        </figure>
                        <p>${developer.username}</p>
                        <a href="/project/recommendDev/${developer.username}/${projectID}" class="recLink">Select</a>
                    </div>
                `);
            });
        }
    } catch (error) {
        console.log(error);
    }
});