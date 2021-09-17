async function GetCustomers() {
    try {
        let fetchRequest = await fetch("/admin/getCustomers");
        let response = await fetchRequest.json();
        return response;
    } catch (error) {
        console.error(error);
    }
}

async function showCustomers() {
    try {
        let customers = await GetCustomers();
        customers = customers.customers;
        let customerContainer = document.querySelector('.customer-profiles-container')
        if(customers.length > 0){
            customers.forEach(customer => {
                customerContainer.insertAdjacentHTML('beforeend' , `
                    <div class="customer">
                        <figure class="customer-figure">
                            <img src="../images/${customer.profileImage}" alt="ProfileImage">
                        </figure>
                        <p>Username: ${customer.username}</p>
                        <p>Email: ${customer.email}</p>
                        <p>First Name: ${customer.name}</p>
                        <p>Last Name: ${customer.surname}</p>
                        <p>Bio: ${customer.bio}</p>
                        <a href="/admin/deleteCustomer/${customer._id}" class="delete-link">Delete</a>
                    </div>
                `);
            });
        }
        else {
            customerContainer.innerHTML = `
            <h2 style="text-align:center;">No customers were found.</h2>
            `
        }
    } catch (error) {
        console.log(error);
    }
}

showCustomers();
