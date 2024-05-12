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

function placeOrder() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const itemName = document.querySelector('.modal-title').textContent.split('Order ')[1];
    const itemPrice = parseFloat(document.querySelector('.modal-body p').textContent.split('Php ')[1]);

    const totalPrice = (quantity * itemPrice).toFixed(0); // Calculate total price
    // Generate Row Id
    const rowId = 'row_' + Math.random().toString(36).substr(2, 9);

    // Check if there is an existing row for the item
    let existingRow = null;
    const rows = document.querySelectorAll('.order-items .row-items');
    rows.forEach(row => {
        const itemNameInRow = row.querySelector('.item').textContent;
        if (itemNameInRow === itemName) {
            existingRow = row;
        }
    });

    if (existingRow) {
        // If an existing row is found, update the quantity
        const existingQuantity = parseInt(existingRow.querySelector('.qty').textContent);
        const newQuantity = existingQuantity + quantity;
        existingRow.querySelector('.qty').textContent = newQuantity;
        const existingTotal = parseFloat(existingRow.querySelector('.total').textContent);
        const newTotalPrice = existingTotal + parseFloat(totalPrice);
        existingRow.querySelector('.total').textContent = newTotalPrice.toFixed(0);
    } else {
        // If no existing row is found, create a new row for the item
        const orderHTML = `
            <div class="row mt-1 mb-1 row-items" id="${rowId}">
                <div class="col-2 list-item p-0 mt-2 qty">${quantity}</div>
                <div class="col-6 list-item p-0 mt-2 item">${itemName}</div>
                <div class="col-2 list-item p-0 mt-2 total">${totalPrice}</div>
                <div class="col-2 list-item p-0"><button class="btn-x btn btn-sm btn-outline-danger" onclick="openConfirmationModal('${itemName}', ${totalPrice}, ${quantity}, '${rowId}')">X</button></div>
            </div>
        `;
        // Append the new row to the order items
        document.querySelector('.order-items').innerHTML += orderHTML;
    }

    // Update the order total
    updateOrderTotal(totalPrice);
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
async function submit() {
    const orderRef = db.collection("orders").doc("d716BHinTx1rHwR96KOV").collection("queue").doc();
    const details = [];
    const currentDate = new Date();
    const rows = document.querySelectorAll('.order-items .row-items');
    const tableid = Math.floor(Math.random() * 12) + 1; // To be changed based on table accounts || cashier account
    const date = firebase.firestore.Timestamp.fromDate(currentDate);
    const status = "pending";
    const total = document.getElementById("order-total-list").innerHTML;
    const docId = localStorage.getItem("userDocId");

    try {
        // Get the highest customer id
        let customerid = await getHighestCustomerId();

        // Increment highestCustomerId
        customerid++;

        // Save order details to Firestore
        const orderData = {
            customerid,
            tableid,
            date,
            status,
            total
        };

        // Add details collection to the order document
        await orderRef.set(orderData);

        const batch = db.batch();
        const detailsCollection = orderRef.collection("details");

        // Add details to batch
        rows.forEach((row, index) => {
            const qtyHTML = row.querySelector('.qty').innerHTML;
            const itemHTML = row.querySelector('.item').innerHTML;
            const totalHTML = row.querySelector('.total').innerHTML;
            const detailData = {
                qty: qtyHTML,
                dish: itemHTML,
                total: totalHTML
            };
            batch.set(detailsCollection.doc(`${index+1}`), detailData);
        });

        // Commit batch
        await batch.commit();
        // console.log("Order and details saved successfully!");
        alert("Order and details saved successfully!");

        // Get the document ID of the newly created order
        const orderId = orderRef.id;
        localStorage.setItem("orderId", orderId);
        console.log("Document ID of the newly created order:", orderId);

        // Update employee status
        const docRef = db.collection("employees").doc(docId);

        try {
            await docRef.update({
                occupantOrderId: orderId, // Assuming orderId is the value you want to set for occupantOrderId
                occupied: true
            });
            console.log("Fields updated successfully!");
        } catch (error) {
            console.error("Error updating fields:", error);
        }
    } catch (error) {
        console.error("Error saving order and details: ", error);
        alert("Error saving order. Please call on a staff.");
    }
}

async function followUpOrder() {
    try {
        const currentDate = new Date();
        const total = document.getElementById("order-total-list").innerHTML;
        const rows = document.querySelectorAll('.order-items .row-items');
        const orderId = localStorage.getItem("orderId");
        const orderRef = db.collection("orders").doc("d716BHinTx1rHwR96KOV").collection("queue").doc(orderId);

        // Step 1: Update existing fields in the document
        const updateData = {
            date: currentDate,
            tota: total,
            status: "pending"
        };

        orderRef.update(updateData)
        .then(() => {
            console.log('Document updated successfully');
        })
        .catch((error) => {
            console.error('Error updating document:', error);
        });

        const batch = db.batch();
        const detailsCollection = orderRef.collection("details");

        // Add details to batch
        rows.forEach((row, index) => {
            const qtyHTML = row.querySelector('.qty').innerHTML;
            const itemHTML = row.querySelector('.item').innerHTML;
            const totalHTML = row.querySelector('.total').innerHTML;
            const detailData = {
                qty: qtyHTML,
                dish: itemHTML,
                total: totalHTML
            };
            batch.set(detailsCollection.doc(`${index+1}`), detailData);
        });

        // Commit batch
        await batch.commit();

    } catch (error) {
        console.error("Error adding new item:", error);
    }
}


// Function to get the highest customer id
async function getHighestCustomerId() {
    const queueRef = db.collection("orders").doc("d716BHinTx1rHwR96KOV").collection("queue");

    let highestCustomerId = 0;

    try {
        const querySnapshot = await queueRef.orderBy("customerid", "desc").limit(1).get();

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                highestCustomerId = doc.data().customerid;
            });
        }
    } catch (error) {
        console.error("Error getting highest customerid:", error);
        throw error;
    }

    return highestCustomerId;
}


// Function to remove all row-items from the place-order div
function removeRowItems(location) {
    // Get all elements with the class "row-items" inside the place-order div
    const rowItems = document.querySelectorAll('.'+location+' .row-items');
    
    // Loop through each row-item and remove it
    rowItems.forEach(rowItem => {
        rowItem.remove();
    });
}

// Function to copy row items to the place-order div
async function copyRowItems(info, order) {
    // Remove all existing row-items from the place-order div
    removeRowItems(info);

    // Get all elements with the class "row-items"
    const rowItems = document.querySelectorAll('.order-items .row-items');

    // Get the text content from the element with id "order-total-list"
    const orderTotal = document.getElementById('order-total-list').textContent;

    // Set the text content of the element with id "place-order-total" to the retrieved text content
    document.getElementById(order).textContent = orderTotal;

    // Get the place-order div
    const placeOrderDiv = document.querySelector('.'+info);

    // Loop through each row-item
    rowItems.forEach(rowItem => {
        // Create a copy of the row-item
        const copy = rowItem.cloneNode(true);

        // Remove the fourth column (actions column) from the copy
        copy.removeChild(copy.lastElementChild);

        // Append the copy to the place-order div
        placeOrderDiv.appendChild(copy);
    });
}

async function checkOnload() {
    // Get the user's document ID from local storage
    const submitButton = document.getElementById("submitButton");
    const docId = localStorage.getItem("userDocId");
    console.log(docId);
    // Reference to the user's document in the "employees" collection
    const docRef = db.collection("employees").doc(docId);
    let occupied, occupantDocId;
    try {
        // Get the user's document data
        const docSnapshot = await docRef.get();
        if (docSnapshot.exists) {
            // Extract occupied and occupantDocId from the user's document data
            
            const dataRef = docSnapshot.data();
            occupied = dataRef.occupied;
            occupantDocId = dataRef.occupantOrderId;
            // console.log(occupied, occupantDocId);
            if (occupied) {
                // If occupied, fetch the order data using occupantDocId
                const orderRef = db.collection("orders").doc("d716BHinTx1rHwR96KOV").collection("queue").doc(occupantDocId);
                const orderSnapshot = await orderRef.get();
                
                if (orderSnapshot.exists) {
                    // Display order details
                    await displayOrderItems(orderRef); // Implement this function to display order items
                    
                    // Open the final modal
                    openFinalModal();
                    submitButton.setAttribute("onclick", "followUpOrder();copyRowItems('final-order', 'final-order-total')")
                } else {
                    console.error("Order document does not exist.");
                }
            } else {
                console.log("A user is not occupying a table.");
            }
        } else {
            console.error("User document not found.");
        }
    } catch (error) {
        console.error("Error retrieving user information:", error);
    }
}

async function displayOrderItems(orderRef) {
    // Iterate over each item in the details array
    const detailsRef = orderRef.collection("details"); // Reference to the "details" subcollection
    const detailsSnapshot = await detailsRef.get(); // Get all documents within the "details" subcollection
    let sum = 0;

    detailsSnapshot.forEach((doc) => {
        // Access individual document data here using doc.data()
        const data = doc.data();
        // console.log(data); // Example: Log each document's data
        // Extract individual item properties   
        const qty = data.qty;
        const dish = data.dish;
        const total = data.total;
        sum += parseInt(total); 
        // Generate a unique row id for each item
        const rowId = 'row_' + Math.random().toString(36).substr(2, 9);

        // Generate HTML for the current item
        const orderHTML = `
            <div class="row mt-1 mb-1 row-items" id="${rowId}">
                <div class="col-2 list-item p-0 mt-2 qty">${qty}</div>
                <div class="col-6 list-item p-0 mt-2 item">${dish}</div>
                <div class="col-2 list-item p-0 mt-2 total">${total}</div>
                <div class="col-2 list-item p-0">
                    <button class="btn-x btn btn-sm btn-outline-danger" onclick="openConfirmationModal('${dish}', ${total}, ${qty}, '${rowId}')" disabled>X</button>
                </div>
            </div>
        `;

        // Append the generated HTML for the current item to the order items section
        document.querySelector('.order-items').innerHTML += orderHTML;
        
    });
    document.getElementById('order-total-list').innerHTML = sum;
}


function openFinalModal() {
    // Implement this function to open the final modal
   // Get a reference to the modal element
    const modal = document.getElementById('finalModal');

    copyRowItems('final-order', 'final-order-total');
    $('#finalModal').modal('show');
}

function hideModal(){
    $('#finalModal').modal('hide');
}

async function billOut(){
    // update the status into bill-out
    // notify on the cashier side
    // remove the occupant and occupantOrderId
    // Update employee status
    const docId = localStorage.getItem("userDocId");
    const docRef = db.collection("employees").doc(docId);

        try {
            await docRef.update({
                occupantOrderId: firebase.firestore.FieldValue.delete(),
                occupied: firebase.firestore.FieldValue.delete() 
            });
            alert("Bill-out notified. Please wait for the waiter.");
        } catch (error) {
            console.error("Error updating fields:", error);
        }
}