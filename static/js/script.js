let currentMapping = {
    local: ["traefik", "web", "websecure"],
    mapping: {
        "web": "web",
        "websecure": "websecure"
    },
    remote: ["webtesting", "web", "websecure"]
};

// Generate local and remote entrypoints dynamically
function generateEntrypoints() {
    const localEntryPoints = currentMapping.local;
    const remoteEntryPoints = ['NONE','DENY',...currentMapping.remote];

    let remoteElements={};

    // Generate remote entrypoints dynamically (each will be an area to drop into)
    const remoteContainer = document.querySelector('.remote-entrypoints');
    remoteEntryPoints.forEach(entry => {
        const entryPointDiv = document.createElement('div');
        entryPointDiv.classList.add('entrypoint', 'remote');
        entryPointDiv.innerHTML = entry;
        entryPointDiv.id = `remote-${entry}`;
        entryPointDiv.classList.add('remote'); 
        entryPointDiv.draggable = false; 
        entryPointDiv.addEventListener('dragover', handleDragOver);
        entryPointDiv.addEventListener('drop', handleDrop);
        remoteContainer.appendChild(entryPointDiv);
        remoteElements[entry] = entryPointDiv;  // Store reference to the remote entrypoint element
    });

    // Generate local entrypoints dynamically
    localEntryPoints.forEach(entry => {
        const entryPointDiv = document.createElement('div');
        entryPointDiv.classList.add('entrypoint');
        entryPointDiv.innerHTML = entry;
        entryPointDiv.id = `local-${entry}`;
        entryPointDiv.draggable = true;  // Make the local entrypoint draggable
        entryPointDiv.classList.add('local'); 
        entryPointDiv.addEventListener('dragstart', handleDragStart);
        remoteElements[currentMapping.mapping[entry]||'NONE'].appendChild(entryPointDiv);
    });
}

// Dragstart event handler to add the draggable item ID
function handleDragStart(event) {
    event.dataTransfer.setData('text', event.target.id);
    event.target.classList.add('dragging');  // Optional: add a class to style the dragged item
}

// Dragover event handler to allow dropping
function handleDragOver(event) {
    event.preventDefault();
    const localId = event.dataTransfer.getData('text');
    const localElement = document.getElementById(localId);
    let remoteElement = event.target;

    // Traverse up the DOM tree until we find the parent with the 'remote' class
    while (remoteElement && !remoteElement.classList.contains('remote')) {
        remoteElement = remoteElement.parentElement;
    }
    remoteElement.appendChild(localElement);
}

// Drop event handler to place local entrypoint into remote entrypoint area
function handleDrop(event) {
    event.preventDefault();
    const localId = event.dataTransfer.getData('text');
    const localElement = document.getElementById(localId);
    let remoteElement = event.target;

    // Traverse up the DOM tree until we find the parent with the 'remote' class
    while (remoteElement && !remoteElement.classList.contains('remote')) {
        remoteElement = remoteElement.parentElement;
    }

    // Make sure we're dropping onto a remote entrypoint
    if (remoteElement.classList.contains('remote')) {
        remoteElement.appendChild(localElement);  // Move the local entrypoint into the remote area
    }
    localElement.classList.remove('dragging');  // Remove the dragging class
    currentMapping.mapping[localElement.id.replace('local-', '')] = remoteElement.id.replace('remote-', '');  // Update the mapping
    updateEntrypointMapping();  // Call the function to update the mapping
}

// Initialize the page when it's ready
document.addEventListener('DOMContentLoaded', () => {
    fetchEntrypointMapping();  // Fetch the initial mapping from the server
    
});



async function updateEntrypointMapping() {
    try {

        const response = await fetch('/api/entrypointMapping', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentMapping.mapping), // Send the updated mapping
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message);
            
        } else {
            alert('Failed to update entrypoint mapping');
        }
    } catch (error) {
        console.error('Error updating entrypoint mapping:', error);
    }
}

async function fetchEntrypointMapping() {
    try {
        const response = await fetch('/api/entrypointMapping');
        const data = await response.json();

        // Populate local and remote entrypoints
        currentMapping = data;
        generateEntrypoints();
    } catch (error) {
        console.error('Error fetching entrypoint mapping:', error);
    }
}