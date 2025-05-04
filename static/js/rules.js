document.addEventListener("DOMContentLoaded", function () {

    // Fetch router data initially
    fetchAndPopulateRoutersRules();
});
// Fetch router data to populate the table
function fetchAndPopulateRoutersRules() {
    fetch('/api/router-rules')
        .then(response => response.json())
        .then(data => {
            populateRoutersRulesTable(data);
        })
        .catch(error => {
            console.error('Error fetching routers:', error);
        });
}

// Function to populate the routers table
function populateRoutersRulesTable(data) {
    const tableBody = document.getElementById('router-rules-table-body');
    tableBody.innerHTML = ''; // Clear any existing content

    if (!data) {
        console.error("No data returned for routers.");
        return;
    }

    const relayedRouters = data.relay || [];
    const deniedRouters = data.deny || [];
    const maxLength = Math.max(relayedRouters.length, deniedRouters.length) + 1;

    for (let i = 0; i < maxLength; i++) {
        const row = document.createElement('tr');

        // Relayed routers in the first column
        const relayedCell = document.createElement('td');
        const relayedInput = document.createElement('input');
        relayedInput.type = 'text';
        relayedInput.value = relayedRouters[i] || '';
        relayedInput.dataset.index = i;  // Store index for easy access
        relayedCell.appendChild(relayedInput);
        row.appendChild(relayedCell);

        // Denied routers in the second column
        const denyCell = document.createElement('td');
        const denyInput = document.createElement('input');
        denyInput.type = 'text';
        denyInput.value = deniedRouters[i] || '';
        denyInput.dataset.index = i;  // Store index for easy access
        denyCell.appendChild(denyInput);
        row.appendChild(denyCell);

        tableBody.appendChild(row);
    }
}

// Handle Update Button click
const updateBtn = document.getElementById('update-router-rules-btn');
updateBtn.addEventListener('click', function () {
    const tableBody = document.getElementById('router-rules-table-body');
    const rows = tableBody.getElementsByTagName('tr');

    const relayValues = [];
    const denyValues = [];

    // Loop through each row to collect the updated values
    for (let row of rows) {
        const inputs = row.getElementsByTagName('input');
        const relayValue = inputs[0].value.trim();  // Get the relay value
        const denyValue = inputs[1].value.trim();   // Get the deny value

        if (relayValue) relayValues.push(relayValue);
        if (denyValue) denyValues.push(denyValue);
    }

    const data = {
        relay: relayValues,
        deny: denyValues
    };

    // Make a PUT request to update the router rules
    fetch('/api/router-rules', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(async data => {
            await Promise.all([
                window.fetchAndPopulateRouters(),  // First fetch operation
                window.fetchAndPopulateRoutersRules()  // Second fetch operation
            ]);

            // Alert the success message after both fetches have completed
            alert(data.message);
        })
        .catch(error => console.error('Error updating router rules:', error));
});

window.fetchAndPopulateRoutersRules = fetchAndPopulateRoutersRules; // Expose the function globally for other scripts
