//--------------------------Login Page Start  -----------------------
function login() {
    const username = document.getElementById('userName').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin') {
        console.log('Redirecting to dashboard...'); // Debug log
        window.location.href = 'dashboard.html'; // Redirect to dashboard
    } else {
        console.log('Invalid login'); // Debug log
        alert('Invalid username or password. Please try again.');
    }
}
//--------------------------Login Page End -----------------------



//--------------------------Dash board Start----------------------

function openPage(page) {
    window.location.href = page; // Redirect to the selected page
}

//--------------------------Dash board End----------------------


//-------------------------Add Customer Form Start------------------- 
let customers = JSON.parse(localStorage.getItem('customers')) || [];
let customerIdCounter = customers.length > 0 ? customers.length + 1 : 1;

const customerForm = document.getElementById('customerForm');
const customerTable = document.getElementById('customerTable').querySelector('tbody');
const searchPhone = document.getElementById('searchPhone');

// auto-generate customer ID
function generateCustomerId() {
    const idNumber = customerIdCounter.toString().padStart(3, '0');
    return `C${idNumber}`;
}

// Render the customer table
function renderTable(filteredCustomers = customers) {
    customerTable.innerHTML = '';
    filteredCustomers.forEach((customer, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.contact}</td>
            <td>
                <button style="background-color: rgba(241, 196, 15,1.0); color: black;" onclick="editCustomer(${index})">Edit</button>
                <button style="background-color: rgba(192, 57, 43,1.0); color: black;" onclick="deleteCustomer(${index})">Delete</button>
                <button style="background-color: rgba(142, 68, 173,1.0); color: black;" onclick="placeOrder(${index})">Place Order</button>
            </td>
        `;
        customerTable.appendChild(row);
    });
}

// Function to save customers to local storage
function saveCustomers() {
    localStorage.setItem('customers', JSON.stringify(customers));
}

// Place order function
function placeOrder(index) {
    const customer = customers[index];
    const customerId = customer.id;
    const customerName = encodeURIComponent(customer.name);
    const customerContact = customer.contact;
    window.location.href = `placeOrder.html?customerId=${customerId}&customerName=${customerName}&customerContact=${customerContact}`;
}

// Check contact already exists
function isDuplicateContact(contact) {
    return customers.some(customer => customer.contact === contact);
}

// Validate the contact number (10 digits)
function isValidContact(contact) {
    const phoneNumberPattern = /^\d{10}$/;
    return phoneNumberPattern.test(contact);
}

// Handle form submission
customerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;

    // Check phone number duplicate
    if (isDuplicateContact(contact)) {
        alert('This contact number is already in use. Please enter a different contact number.');
        return;
    }

    // Validate phone number length (10 digits)
    if (!isValidContact(contact)) {
        alert('Contact number must be exactly 10 digits.');
        return;
    }

    const newCustomer = {
        id: generateCustomerId(),
        name,
        contact
    };

    customers.push(newCustomer);
    customerIdCounter++;
    saveCustomers(); // Save to local storage
    renderTable();
    customerForm.reset();
});

// Function to edit customer data
function editCustomer(index) {
    const customer = customers[index];
    const newName = prompt('Enter new name:', customer.name);
    const newContact = prompt('Enter new contact:', customer.contact);

    // Check if the new contact number is a duplicate
    if (newContact !== customer.contact && isDuplicateContact(newContact)) {
        alert('This contact number is already in use. Please enter a different contact number.');
        return;
    }

    // Validate new contact number length (10 digits)
    if (!isValidContact(newContact)) {
        alert('Contact number must be exactly 10 digits.');
        return;
    }

    if (newName && newContact) {
        customers[index].name = newName;
        customers[index].contact = newContact;
        saveCustomers(); // Save to local storage
        renderTable();
    }
}

// Function to delete customer
function deleteCustomer(index) {
    customers.splice(index, 1);
    saveCustomers(); // Save to local storage
    renderTable();
}

// Function to search customer by phone number
function searchCustomer() {
    const phone = searchPhone.value;

    if (!isValidContact(phone)) {
        alert('Please enter a valid 10-digit contact number for the search.');
        return;
    }

    const filteredCustomers = customers.filter(customer => customer.contact === phone);

    if (filteredCustomers.length === 0) {
        alert('No customer found with this phone number.');
    }

    renderTable(filteredCustomers);
}

// Initial rendering of the customer table
renderTable();


//-------------------------Add Customer form End--------------------




//--------------place order login and sign form start--------------

// Add item to cart
function addToCart(itemCode, itemName, price) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || []; // Changed to sessionStorage
    const existingItem = cart.find(item => item.itemCode === itemCode);

    if (existingItem) {
        existingItem.quantity += 1; 
    } else {
        cart.push({ itemCode, itemName, price, quantity: 1 });
    }

    sessionStorage.setItem('cart', JSON.stringify(cart)); // Changed to sessionStorage
    alert(`${itemName} has been added to your cart!`); 
}

// Function to show the cart modal
function showCart() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || []; // Changed to sessionStorage
    const cartDiv = document.getElementById('cart');
    cartDiv.innerHTML = ''; 
    let totalPrice = 0;

    if (cart.length === 0) {
        cartDiv.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach((item) => {
            totalPrice += item.price * item.quantity; // Calculate total price
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-card');
            cartItemDiv.innerHTML = `
                <p>Item Code: ${item.itemCode}</p>
                <p>Item Name: ${item.itemName}</p>
                <p>Price: ${item.price} LKR</p>
                <p>Quantity: 
                    <button class="update-btn" onclick="updateQuantity('${item.itemCode}', -1)">-</button>
                    ${item.quantity}
                    <button class="update-btn" onclick="updateQuantity('${item.itemCode}', 1)">+</button>
                </p>
                <button class="remove-btn" onclick="removeFromCart('${item.itemCode}')">Remove</button>
            `;
            cartDiv.appendChild(cartItemDiv);
        });
    }

    document.getElementById('totalPrice').innerText = totalPrice.toFixed(2);
    document.getElementById('cartModal').style.display = "block"; // Show modal
}

// Function to close the modal
function closeModal() {
    document.getElementById('cartModal').style.display = "none";
}

// Function to update item quantity
function updateQuantity(itemCode, change) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || []; // Changed to sessionStorage
    const item = cart.find(item => item.itemCode === itemCode);

    if (item) {
        item.quantity += change; // Update quantity
        if (item.quantity <= 0) {
            removeFromCart(itemCode); // Remove item if quantity is zero or less
        } else {
            sessionStorage.setItem('cart', JSON.stringify(cart)); // Changed to sessionStorage
        }
    }

    showCart(); 
}

// Function to remove item from cart
function removeFromCart(itemCode) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || []; // Changed to sessionStorage
    cart = cart.filter(item => item.itemCode !== itemCode); 
    sessionStorage.setItem('cart', JSON.stringify(cart)); // Changed to sessionStorage
    showCart(); 
}

// Function to generate bill
function generateBill() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || []; // Changed to sessionStorage
    let billContent = 'Item Code | Item Name | Price (LKR) | Quantity\n';
    billContent += '-----------------------------------------------\n';

    cart.forEach(item => {
        billContent += `${item.itemCode} | ${item.itemName} | ${item.price} | ${item.quantity}\n`;
    });

    billContent += `-----------------------------------------------\n`;
    billContent += `Total: ${document.getElementById('totalPrice').innerText} LKR`;

    const blob = new Blob([billContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bill.txt'; // Change to .pdf if you want to create a PDF
    a.click();
    URL.revokeObjectURL(url);
}

// Initial render of cart
if (sessionStorage.getItem('cart')) { // Changed to sessionStorage
    showCart();
}

// Function to clear the cart
function clearCart() {
    sessionStorage.removeItem('cart'); // Clear the cart from sessionStorage
    document.getElementById('totalPrice').innerText = '0.00'; // Reset total price
    alert("Cart cleared.");
    showCart(); // Update the cart display
}


//--------------place order login and sign form end--------------
