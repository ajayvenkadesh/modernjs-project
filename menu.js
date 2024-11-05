// Function to fetch and display menu details
async function fetchMenu() {
    try {
        const response = await axios.get('menu.json'); // Replace with your actual API URL
        const menuData = response.data;

        // Display menu items initially
        filterMenu(menuData); // Shows all items on load by default
    } catch (error) {
        console.error("Error fetching menu data:", error);
    }
}

// Function to filter and display menu based on category
function filterMenu(menuData) {
    const category = document.getElementById('categorySelect').value.trim();
    const menuTableBody = document.querySelector('#menuTable tbody');
    
    // Clear existing table rows
    menuTableBody.innerHTML = '';

    // Filter menu items based on selected category
    const filteredItems = menuData.menu.filter(item => {
        // Check if category matches or if "Select Category" is selected (show all items)
        return category === '' || item.category.toLowerCase() === category.toLowerCase();
    });

    // Populate table with filtered items
    filteredItems.forEach(item => {
        const row = document.createElement('tr');
        const itemNameCell = document.createElement('td');
        const priceCell = document.createElement('td');

        itemNameCell.textContent = item.itemName;
        priceCell.textContent = `₹${item.price}`;

        row.appendChild(itemNameCell);
        row.appendChild(priceCell);
        menuTableBody.appendChild(row);
    });
}

// Attach fetchMenu to load and set up filterMenu on change
document.addEventListener('DOMContentLoaded', function() {
    fetchMenu(); // Fetches and displays menu on page load
});

document.getElementById('categorySelect').addEventListener('change', async function() {
    const response = await axios.get('menu.json'); // Get the data again
    filterMenu(response.data); // Reapply filtering with updated category
});
