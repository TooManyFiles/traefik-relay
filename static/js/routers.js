document.addEventListener("DOMContentLoaded", function () {
    // Fetch data and populate for routers
    fetchAndPopulateRouters();
});


function fetchAndPopulateRouters() {
    fetch('/api/routers')
        .then(response => response.json())
        .then(data => {
            console.log('Routers data:', data);  // Log to check the response structure
            populateRoutersTable(data);
        })
        .catch(error => {
            console.error('Error fetching routers:', error);
        });
}


// Function to populate the routers table
function populateRoutersTable(data) {
    const tableBody = document.getElementById('router-table-body');
    tableBody.innerHTML = ''; // Clear any existing content

    if (!data) {
        console.error("No data returned for routers.");
        return;
    }

    // Get arrays of relayed and denied routers
    const relayedRouters = data.relay || [];
    const deniedRouters = data.deny || [];

    // Find the maximum length of the two arrays to handle uneven lengths
    const maxLength = Math.max(relayedRouters.length, deniedRouters.length);

    // Loop through and populate the table rows
    for (let i = 0; i < maxLength; i++) {
        const row = document.createElement('tr');

        // Relayed routers go in the first column
        const relayedCell = document.createElement('td');
        if (relayedRouters[i]) {
            relayedCell.textContent = relayedRouters[i];
        }
        row.appendChild(relayedCell);

        // Denied routers go in the second column
        const denyCell = document.createElement('td');
        if (deniedRouters[i]) {
            denyCell.innerHTML = "<span>" + deniedRouters[i] + "</span>";
        }
        row.appendChild(denyCell);
        let buttonTd = document.createElement('td');
        const button = document.createElement('button');
        button.textContent = "Add to Allow";
        button.className = "btn btn-primary";
        button.onclick = function () {
            addToAllow(denyCell);
        }
        buttonTd.appendChild(button);
        row.appendChild(buttonTd);
        tableBody.appendChild(row);
    }
}

function addToAllow(denyCell) {
    const tableBody = document.getElementById('router-rules-table-body');
    const rows = tableBody.getElementsByTagName('tr');

    const relayValues = ["^"+denyCell.textContent.trim()+"$"];
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
            ])

            alert(data.message);  // Show the success message after both fetches are done

        })
        .catch(error => console.error('Error updating router rules:', error));

}
window.fetchAndPopulateRouters=fetchAndPopulateRouters;