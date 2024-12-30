const isPremium = window.localStorage.getItem("isPremium");
const token = window.localStorage.getItem("token");
const UserId = window.localStorage.getItem('user');

document.getElementById('addexpense').addEventListener('click', async (event) => {
    event.preventDefault();
    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    // const token = window.localStorage.getItem('token');
    try {
        const response = await axios.post(`http://localhost:3000/api/expense`, { amount, description, category }, { headers: { 'authorization': token } });

        if (response.status === 201) {
            console.log(response.data);
            location.reload();
        } else {
            console.log(response.data);
        }
    } catch (error) {
        console.error(error);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const isPremium = window.localStorage.getItem("isPremium");
    if (isPremium == 'true') {
        document.getElementById('rzp-btn').style.display = "none";
        document.getElementById('premiums').style.display = 'block';
        document.getElementById('show-leader-div').style.display = 'block';
        document.getElementById('rzp-btn-div').style.display = 'none';
        document.getElementById('content-leadboard').style.display = 'none';
    } 
    if (isPremium == "false") {
        document.getElementById('rzp-btn').style.display = "block";
        document.getElementById('premiums').style.display = 'none';
        document.getElementById('show-leader-div').style.display = 'none';
        document.getElementById('rzp-btn-div').style.display = 'block';
        document.getElementById('content-leadboard').style.display = 'none';
    }
    // const contentElement = document.getElementById('content-expense');

    try {
        // const response = await axios.get('http://localhost:3000/api/expense', {
        //     headers: { "authorization": token }
        // });
        const responseUser = await axios.get('http://localhost:3000/api/users', {
            headers: { "authorization": token }
        });
        premiumUserData = responseUser.data;

        const pageSize = getPageSizePreference();
        renderPageSizeSelector();
        fetchExpenses(1, pageSize);

        // if (response.data.userExpense && response.data.userExpense.length > 0) {
        //     // renderTable(response.data.userExpense, currentPage);
        // } else {
        //     contentElement.innerHTML = '<p>No expenses found for this user.</p>';
        // }


        // } 

        document.getElementById('show-leader').addEventListener('click', () => {

            document.getElementById('show-leader').style.display = 'none';
            document.getElementById('show-leader-div').style.display = 'none';
            document.getElementById('content-leadboard').style.display = 'block';
            if (premiumUserData && premiumUserData.length > 0) {
                const leaderboardContainer = document.getElementById('content-leadboard');

                const leaderboardHeader = document.createElement('h4');
                leaderboardHeader.textContent = 'Expenses Leaderboard';
                leaderboardHeader.classList.add('text-center', 'my-4'); // Added display-4 for larger text

                leaderboardContainer.appendChild(leaderboardHeader);

                const table = document.createElement('table');
                table.classList.add('table', 'table-bordered', 'table-striped', 'table-hover', 'table-responsive'); // Added responsive class for better layout on small screens

                const headerRow = document.createElement('tr');
                headerRow.innerHTML = `
                    <th>Name</th>
                    <th>Amount</th>
                `;
                table.appendChild(headerRow);

                premiumUserData.sort((a, b) => b.totalamount - a.totalamount);

                premiumUserData.forEach(user => {
                    const expenseRow = document.createElement('tr');
                    expenseRow.innerHTML = `
                        <td>${user.name}</td>
                        <td>$${user.totalamount || 0}</td> <!-- Format amount to 2 decimal places -->
                    `;
                    table.appendChild(expenseRow);
                });

                leaderboardContainer.appendChild(table);

            } else {
                const message = document.createElement('p');
                message.textContent = 'No data available for the leaderboard.';
                message.classList.add('text-center', 'my-4');
                leaderboardContainer.appendChild(message);
            }
        });

    } catch (err) {
        console.log(err);
        contentElement.innerHTML = '<p>No expenses found for this user.</p>';
    }
});


async function handleDelete(id) {
    try {
        const response = await axios.delete(`http://localhost:3000/api/expense/${id}`, { headers: { 'authorization': token } })
        location.reload();
    } catch (err) {
        console.log(err)
    }

}

document.getElementById('rzp-btn').addEventListener('click', async () => {
    const response = await axios.get("http://localhost:3000/api/premium/purchasepremium", { headers: { 'authorization': token } })

    var options = {
        'key': response.data.key_id,
        'order_id': response.data.order.id,
        'handler': async function (response) {
            await axios.post('http://localhost:3000/api/premium/updateorderstatus', {
                orderid: options.order_id,
                paymentid: response.razorpay_payment_id
            }, { headers: { 'authorization': token } })
            window.location.setItem('isPremium', 'true');
            alert("Your Premium activated!");
        }
    }

    const raz = new Razorpay(options);
    raz.open();
});

document.getElementById('downloadexpense').addEventListener('click', async () => {

    await axios.get('http://localhost:3000/api/expense/download', { headers: { 'authorization': token } })
        .then((resp) => {
            // if(resp.status == 200){
            var a = document.createElement('a');
            a.href = resp.data.fileUrl;
            a.download = 'My_Expenses.txt';
            a.click();
            // }
        }).catch((err) => {
            console.log(err)
        });
})




function savePageSizePreference(size) {
    localStorage.setItem('expensePageSize', size);
}

function getPageSizePreference() {
    return parseInt(localStorage.getItem('expensePageSize')) || 10; // Default to 10
}

async function fetchExpenses(page = 1, pageSize = 10) {
    try {
        const response = await axios.get(
            `http://localhost:3000/api/expense/?page=${page}&pageSize=${pageSize}`,
            {
                headers: { Authorization: token },
            }
        );

        if (response.data) {
            const { userExpense, currentPage, totalPages } = response.data;
            renderTable(userExpense, pageSize, currentPage);
            renderPaginationControls(currentPage, totalPages, pageSize);
        } else {
            console.error("Error fetching expenses:", response.statusText);
        }
    } catch (error) {
        console.error("Error fetching expenses:", error);
    }
}

function renderTable(expenses, pageSize, currentPage, totalPages) {
    const contentElement = document.getElementById('content-expense');
    contentElement.innerHTML = '';

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    const headerRow = document.createElement('tr');
    headerRow.style.backgroundColor = '#f8f9fa';
    headerRow.innerHTML = `
        <th style="padding: 5px; border: 1px solid #ddd; text-align: left; font-size: 12px;">Description</th>
        <th style="padding: 5px; border: 1px solid #ddd; text-align: left; font-size: 12px;">Amount</th>
        <th style="padding: 5px; border: 1px solid #ddd; text-align: left; font-size: 12px;">Category</th>
        <th style="padding: 5px; border: 1px solid #ddd; text-align: left; font-size: 12px;">Action</th>
    `;
    table.appendChild(headerRow);

    expenses.forEach((expense) => {
        const expenseRow = document.createElement('tr');
        expenseRow.style.border = '1px solid #ddd';

        expenseRow.innerHTML = `
            <td class='border' style=" padding: 2px; text-align: left; font-size: 12px;">${expense.description}</td>
            <td  class='border' style=" padding: 2px; text-align: left; font-size: 12px;">$${expense.amount}</td>
            <td  class='border' style="padding: 2px; text-align: left; font-size: 12px;">${expense.category}</td>
            <td  class='border' style="padding: 2px; text-align: left; font-size: 12px;">
                <button type="button" style="font-size: 12px; padding: 5px 5px; background-color:rgb(177, 49, 62); color: white; border: none; cursor: pointer;"
                        class="delete-btn" data-id="${expense.id}">
                    Delete
                </button>
            </td>
        `;
        table.appendChild(expenseRow);
    });

    contentElement.appendChild(table);

    contentElement.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const expenseId = event.target.getAttribute('data-id');
            handleDelete(expenseId);
        }
    });
}

function renderPaginationControls(currentPage, totalPages, pageSize) {
    const paginationControlsElement = document.getElementById('pagination-controls');
    let paginationHTML = '';


    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="btn btn-primary"  style="margin: 5px; font-size: 12px; padding: 3px 8px;" 
                    onclick="fetchExpenses(${i}, ${pageSize})"
                    ${i === currentPage ? 'disabled' : ''}>
                ${i}
            </button>
        `;
    }

    paginationControlsElement.innerHTML = paginationHTML;
}

function renderPageSizeSelector() {
    const pageSizeSelector = document.getElementById('page-size-selector');
    const savedSize = getPageSizePreference();

    pageSizeSelector.value = savedSize;

    pageSizeSelector.addEventListener('change', (event) => {
        const newSize = parseInt(event.target.value, 10);
        savePageSizePreference(newSize);
        fetchExpenses(1, newSize);
    });
}

function getPageSizePreference() {
    return localStorage.getItem('pageSize') || 10;
}

function savePageSizePreference(size) {
    localStorage.setItem('pageSize', size);
}
