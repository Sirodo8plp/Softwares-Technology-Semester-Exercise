async function getAllSuggestedTechnologyTags() {
    try {
        let fetchRequest = await fetch("/project/getFreeTags");
        let tags = await fetchRequest.json();
        return tags;
    } catch (fetchError) {
        console.error(fetchError);
    }
}

async function showAllSuggestedTechnologyTags() {
    tags = await getAllSuggestedTechnologyTags();
    tagsContainer = document.querySelector('#suggestedTechTags');
    if (tags.length === 0) {
        tagsContainer.insertAdjacentHTML('beforeend', "<h2>There aren't any projects active for now.</h2>");
        return;
    }
    tags.forEach((tag, count) => {
        tagsContainer.insertAdjacentHTML('beforeend', `
            <a href="#" class="technology" id="${tag}">${tag}</a>
        `);
    });
}

showAllSuggestedTechnologyTags().then(() => {
    getProjects();
    filterProjects();
});

function filterProjects() {
    let links = Array.from(document.querySelectorAll('.left-content a'));
    links.shift();
    links.forEach(linkElement => {
        linkElement.addEventListener('click', (event) => {
            console.log(linkElement);
            if (linkElement.parentElement.classList.contains('left-categories') && !linkElement.classList.contains('selected')) {
                Array.from(document.querySelectorAll('.left-categories a')).forEach(element => {
                    element.classList.remove('selected');
                })
            } else if (linkElement.parentElement.classList.contains('left-subcategories') && !linkElement.classList.contains('selected')) {
                Array.from(document.querySelectorAll('.left-subcategories a')).forEach(element => {
                    element.classList.remove('selected');
                })
            }
            applySelectionClass(linkElement);

            let filters = {
                technologies: "",
                category: "",
                subcategory: ""
            };

            try {
                filters.technologies = Array.from(document.querySelectorAll('#suggestedTechTags a.selected')).map(link => link.id).join();
            } catch (error) {}

            try {
                filters.category = document.querySelector('.left-categories a.selected').innerHTML;
            } catch (error) {console.error(error)}

            try {
                filters.subcategory = document.querySelector('.left-subcategories a.selected').innerHTML;
            } catch (error) {}
            
            let options = {
				method: "POST",
				body: JSON.stringify(filters),
				headers: {
					'Content-Type': 'application/json'
				}
			}
            fetch("/project/applyFilters", options)
            .then(response => response.json())
            .then(data => {
                ShowProjects(data);
            })
            .catch(error => console.error(error));
        })
    });
}

function applySelectionClass(linkElement) {
    if (linkElement.classList.contains('selected'))
        linkElement.classList.remove('selected');
    else
        linkElement.classList.add('selected');

}