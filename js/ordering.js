// // Query the 'foods' collection
// db.collection("foods").get().then((querySnapshot) => {
//     // Iterate through each document in the collection
//     querySnapshot.forEach((doc) => {
//         // Print the name of each document
//         console.log(doc.data());
//     });
// }).catch((error) => {
//     console.log("Error getting documents: ", error);
// });

// Function to generate HTML content for an item
function generateHTMLContent(itemName, itemPrice) {
    return `
        <td class="table-item ps-4 pe-4">
            <div class="row">
                <div class="col-12">
                    <img class="menu-item" src="images/butted-shrimp.jpg" alt="Food Image" height="100%" width="100%"> 
                </div>
            </div>
            <div class="row pt-2">
                <div class="col-12">
                    <h6><b>${itemName}</b></h6>
                </div>
                <div class="col-12">
                    <h6>Php ${itemPrice}</h6>
                </div>
            </div>
            <div class="row">
                <div class="col-12 d-grid mx-auto m-2">
                    <button class="btn btn-success" type="button" data-bs-toggle="modal" data-bs-target="#orderModal" data-item-name="${itemName}" data-item-price="${itemPrice}">Order</button>
                </div>
            </div>
        </td>`;
}

// Filter Items
filterItems('all');
function filterItems(category) {
    // Remove 'btn-active' class from all buttons
    const buttons = document.querySelectorAll('.btn-custom');
    buttons.forEach(button => {
        button.classList.remove('btn-active');
    });

    // Add 'btn-active' class to the clicked button
    const clickedButton = document.getElementById(category);
    clickedButton.classList.add('btn-active');

    // Clear the contents of 'append-1' and 'append-2'
    document.getElementById('append-1').innerHTML = '';
    document.getElementById('append-2').innerHTML = '';

    // Fetch data based on the selected category
    if (category === 'all') {
        // Fetch all items
        // Replace this with your actual logic to fetch all items from the database
        console.log('Fetching all items...');
        let counter = 0; // Initialize counter
        db.collection("foods").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const dishId = doc.id;
                const dishTag = data.tag;
                console.log(`Tag ID: ${dishId}, Name: ${dishTag}`);

                // Fetch items within the "items" subcollection for the current document
                db.collection("foods").doc(dishId).collection("items").get().then((itemSnapshot) => {
                    let htmlContent = ''; // Initialize HTML content string
                    itemSnapshot.forEach((itemDoc) => {
                        const itemData = itemDoc.data();
                        const itemName = itemData.dish;
                        const itemPrice = itemData.price;
                        // Construct HTML content for the item
                        htmlContent = generateHTMLContent(itemName, itemPrice);
                        counter++; // Increment counter
                        // Append the HTML content to the target element based on the counter value
                        const targetId = counter % 2 === 0 ? "append-2" : "append-1";
                        document.getElementById(targetId).innerHTML += htmlContent;
                        // Reset htmlContent for the next document
                        htmlContent = '';
                    });

                    
                }).catch((error) => {
                    console.log("Error getting items: ", error);
                });
            });
        }).catch((error) => {
            console.log("Error getting documents: ", error);
        });        
    } else {
        // Fetch items for the selected category
        console.log(`Fetching items for category: ${category}...`);
        let counter = 0; // Initialize counter
        db.collection("foods").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const dishId = doc.id;
                const dishTag = data.tag;
                console.log(`Tag ID: ${dishId}, Name: ${dishTag}`);
                if(dishTag == category){
                    // Fetch items within the "items" subcollection for the current document
                    db.collection("foods").doc(dishId).collection("items").get().then((itemSnapshot) => {
                        let htmlContent = ''; // Initialize HTML content string
                        itemSnapshot.forEach((itemDoc) => {
                            const itemData = itemDoc.data();
                            const itemName = itemData.dish;
                            const itemPrice = itemData.price;
                            // Construct HTML content for the item
                            htmlContent = generateHTMLContent(itemName, itemPrice);
                            counter++; // Increment counter
                            console.log(counter);
                            // Append the HTML content to the target element based on the counter value
                            const targetId = counter % 2 === 0 ? "append-2" : "append-1";
                            document.getElementById(targetId).innerHTML += htmlContent;
                            // Reset htmlContent for the next document
                            htmlContent = '';
                        });         
                    }).catch((error) => {
                        console.log("Error getting items: ", error);
                    });
                }
            });
        }).catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }
}


document.getElementById('orderModal').addEventListener('show.bs.modal', function (event) {
    // Extract item name and price from the triggering button's data attributes
    var button = event.relatedTarget;
    var itemName = button.dataset.itemName;
    var itemPrice = parseFloat(button.dataset.itemPrice); // Parse price as a float
    
    // Update modal content with item name and price
    var modal = this;
    modal.querySelector('.modal-title').textContent = 'Order ' + itemName;
    modal.querySelector('.modal-body').innerHTML = `
        <p>Price: Php ${itemPrice.toFixed(2)}</p>
        <form>
            <div class="mb-3">
                <label for="quantity" class="form-label">Quantity</label>
                <div class="input-group">
                    <button class="btn btn-outline-secondary" type="button" id="decrementBtn">-</button>
                    <input type="number" class="form-control" id="quantity" min="1" value="1">
                    <button class="btn btn-outline-secondary" type="button" id="incrementBtn">+</button>
                </div>
            </div>
            <p>Total Price: <span id="totalPrice">Php 0.00</span></p>
        </form>`;

    // Function to calculate total price
    function calculateTotalPrice(quantity) {
        return (itemPrice * quantity).toFixed(2); // Calculate total price and round to 2 decimal places
    }

    // Modal Trigger functionality
    const decrementBtn = modal.querySelector('#decrementBtn');
    const incrementBtn = modal.querySelector('#incrementBtn');
    const quantityInput = modal.querySelector('#quantity');
    const totalPriceSpan = modal.querySelector('#totalPrice');
    
    decrementBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 0) {
            quantityInput.value = currentValue - 1;
            totalPriceSpan.textContent = 'Php ' + calculateTotalPrice(currentValue - 1);
        }
    });

    incrementBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
        totalPriceSpan.textContent = 'Php ' + calculateTotalPrice(currentValue + 1);
    });

    quantityInput.addEventListener('input', function() {
        const currentValue = parseInt(quantityInput.value);
        totalPriceSpan.textContent = 'Php ' + calculateTotalPrice(currentValue);
    });
});

// Modal Order Button
function placeOrder() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const itemName = document.querySelector('.modal-title').textContent.split('Order ')[1];
    const itemPrice = parseFloat(document.querySelector('.modal-body p').textContent.split('Php ')[1]);

    const totalPrice = (quantity * itemPrice).toFixed(0); // Calculate total price
    // Generate Row Id
    const rowId = 'row_' + Math.random().toString(36).substr(2, 9);

    // Create HTML content for the ordered item
    const orderHTML = `
        <div class="row mt-1 mb-1 row-items" id="${rowId}">
            <div class="col-2 list-item p-0 mt-2 qty">${quantity}</div>
            <div class="col-6 list-item p-0 mt-2 item">${itemName}</div>
            <div class="col-2 list-item p-0 mt-2 total">${totalPrice}</div>
            <div class="col-2 list-item p-0"><button class="btn-x btn btn-sm btn-outline-danger" onclick="openConfirmationModal('${itemName}', ${totalPrice}, ${quantity}, '${rowId}')">X</button></div>
        </div>
    `;

    // Append the HTML content to the specified element
    document.querySelector('.order-items').innerHTML += orderHTML;

    // Update the order total
    updateOrderTotal(totalPrice);

    // Close the modal
    // Hide the modal
    const orderModal = document.getElementById('orderModal');
    const modal = bootstrap.Modal.getInstance(orderModal);
    modal.hide();
}
// Confirm Modal
function openConfirmationModal(itemName, totalPrice, quantity, rowId) {
    // Display the item name and total price in the confirmation modal
    document.querySelector('#confirmationModal .modal-body').innerHTML = `Item: ${itemName}<br>Quantity: ${quantity}<br>Total Price: Php ${totalPrice.toFixed(2)}`;

    // Show the confirmation modal
    document.getElementById('confirmationModal').classList.add('show');
    document.getElementById('confirmationModal').style.display = 'block';

    document.getElementById('confirmationSuccessBtn').addEventListener('click', function(event) {
        // Find the row element by its ID
        const row = document.getElementById(rowId).remove();
        updateOrderTotal(-totalPrice);
        // Hide the modal
        document.getElementById('confirmationModal').classList.remove('show');
        document.getElementById('confirmationModal').style.display = 'none';
    });
}

// Function to update the order total
function updateOrderTotal(totalPrice) {
    // Get the current order total
    console.log(totalPrice);
    const orderTotalElement = document.getElementById('order-total-list');
    console.log(orderTotalElement);
    if (orderTotalElement) {
        let currentTotal = parseFloat(orderTotalElement.innerHTML);
        if (isNaN(currentTotal)) {
            currentTotal = 0;
        }
        // Add the new total price to the current total
        const newTotal = currentTotal + parseFloat(totalPrice);
        // Update the order total in the DOM
        orderTotalElement.innerHTML = newTotal.toFixed(0);
    }
}

document.querySelector('#confirmationModal .btn-secondary').addEventListener('click', function() {
    // Hide the modal without removing the row
    const modal = document.getElementById('confirmationModal');
    modal.classList.remove('show');
    modal.style.display = 'none';
});

document.querySelector('#confirmationModal .btn-close').addEventListener('click', function() {
    // Hide the modal without removing the row
    const modal = document.getElementById('confirmationModal');
    modal.classList.remove('show');
    modal.style.display = 'none';
});
// Submit to database verification
function submit() {
    const details = [];
    const currentDate = new Date();
    const rows = document.querySelectorAll('.row-items');
    const customerid = Math.floor(Math.random() * 200) + 1;
    const tableid = Math.floor(Math.random() * 12) + 1;
    const date = firebase.firestore.Timestamp.fromDate(currentDate);
    const status = "pending";
    const total = document.getElementById("order-total-list").innerHTML;
    
    rows.forEach(row => {
        const qtyHTML = row.querySelector('.qty').innerHTML;
        const itemHTML = row.querySelector('.item').innerHTML;
        const totalHTML = row.querySelector('.total').innerHTML;
        // Add collected HTML to the array
        details.push({ qtyHTML, itemHTML, totalHTML });
    });

    // Save order details to Firestore
    const orderRef = db.collection("orders").doc("BawoijACJlbVRi8sHQqI").collection("queue").doc();
    const orderData = {
        customerid,
        tableid,
        date,
        status,
        total
    };

    // Add details collection to the order document
    orderRef.set(orderData).then(() => {
        const batch = db.batch();
        const detailsCollection = orderRef.collection("details");
        details.forEach((detail, index) => {
            const { qtyHTML, itemHTML, totalHTML } = detail;
            const detailData = {
                qty: qtyHTML,
                dish: itemHTML,
                total: totalHTML
            };
            batch.set(detailsCollection.doc(`${index+1}`), detailData);
        });
        return batch.commit();
    }).then(() => {
        console.log("Order and details saved successfully!");
        alert("Order and details saved successfully!");
        location.reload();
    }).catch((error) => {
        console.error("Error saving order and details: ", error);
        alert("Error saving order. Please call on a staff.");
    });
}


