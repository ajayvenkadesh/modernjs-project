let totalAmount = 0;

function addItem() {
    const orderItems = document.getElementById('orderItems');
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('form-group');

    itemDiv.innerHTML = `
        <label>Category:</label>
        <input type="text" class="category" required>
        <label>Item Name:</label>
        <input type="text" class="itemName" required>
        <label>Price (INR):</label>
        <input type="number" class="price" value="0" min="0" required>
        <label>Quantity:</label>
        <input type="number" class="quantity" value="0" min="0" required>
        <label>Amount:</label>
        <input type="number" class="amount" value="0" readonly>
        <button type="button" onclick="addOrderItem(this)">Add</button>
        <div class="error"></div>
    `;

    orderItems.appendChild(itemDiv);

    // Attach event listeners to update amount and total
    const priceField = itemDiv.querySelector('.price');
    const quantityField = itemDiv.querySelector('.quantity');
    priceField.addEventListener('input', updateItemAmount);
    quantityField.addEventListener('input', updateItemAmount);
}

function updateItemAmount(event) {
    const itemDiv = event.target.closest('.form-group');
    const price = itemDiv.querySelector('.price').value;
    const quantity = itemDiv.querySelector('.quantity').value;
    const amountField = itemDiv.querySelector('.amount');
    amountField.value = price * quantity;
    updateTotalAmount();
}

function updateTotalAmount() {
    totalAmount = 0;
    document.querySelectorAll('.amount').forEach(amount => {
        totalAmount += parseFloat(amount.value);
    });
    document.getElementById('totalAmount').value = totalAmount;
}

function addOrderItem(button) {
    const itemDiv = button.closest('.form-group');
    button.disabled = true; // Disable add button
    itemDiv.querySelectorAll('input').forEach(input => input.readOnly = true); // Make fields read-only
    updateTotalAmount();
}

document.getElementById('orderForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Validate form and check for free soft drink
    const isValid = validateForm();
    if (isValid) {
        const mainCourseCount = Array.from(document.querySelectorAll('.category')).filter(
            category => category.value.toLowerCase() === "main course"
        ).length;

        let message = `Total amount to be paid: INR ${totalAmount}`;
        if (mainCourseCount >= 2) {
            message += "\nThe order is eligible for a free soft drink!";
        }
        alert(message);

        // Save to JSON server
        saveOrder();
    }
});

function validateForm() {
    let isValid = true;
    ['orderId', 'customerName', 'email', 'contactNumber', 'address'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const errorDiv = document.getElementById(fieldId + 'Error');
        if (!field.value.trim()) {
            errorDiv.textContent = `${fieldId.replace(/([A-Z])/g, ' $1')} is required.`;
            isValid = false;
        } else {
            errorDiv.textContent = '';
        }
    });

    const contactNumber = document.getElementById('contactNumber');
    if (!/^\d{10}$/.test(contactNumber.value)) {
        document.getElementById('contactNumberError').textContent = 'Contact Number must be 10 digits.';
        isValid = false;
    }

    const address = document.getElementById('address');
    if (address.value.length < 10) {
        document.getElementById('addressError').textContent = 'Address should be at least 10 characters long.';
        isValid = false;
    }

    return isValid;
}

async function saveOrder() {
    const orderDetails = {
        orderId: document.getElementById('orderId').value,
        customerName: document.getElementById('customerName').value,
        email: document.getElementById('email').value,
        contactNumber: document.getElementById('contactNumber').value,
        address: document.getElementById('address').value,
        orderItems: Array.from(document.querySelectorAll('#orderItems .form-group')).map(item => ({
            category: item.querySelector('.category').value,
            itemName: item.querySelector('.itemName').value,
            price: item.querySelector('.price').value,
            quantity: item.querySelector('.quantity').value,
            amount: item.querySelector('.amount').value
        })),
        totalAmount: totalAmount
    };

    try {
        const response = await axios.post('http://localhost:3000/order', orderDetails);
        console.log('Order saved:', response.data);
    } catch (error) {
        console.error('Error saving order:', error);
    }
}
