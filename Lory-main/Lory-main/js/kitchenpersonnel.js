const tableList = document.getElementById("list");

const populateTable = () => {
    let count = 0;
    db.collection("orders").doc("d716BHinTx1rHwR96KOV").collection("queue").orderBy("date", "desc").get().then((itemSnapshot) => {
        itemSnapshot.forEach((itemDoc) => {
            const itemData = itemDoc.data();
            const tableID = itemData.tableid;
            const customerID = itemData.customerid;
            const status = itemData.status;
            let completed = 0;
            let pending = 0;

            // Check if "checklist" collection exists
            db.collection("orders").doc("d716BHinTx1rHwR96KOV").collection("queue").doc(itemDoc.id).collection("checklist").get().then((checklistSnapshot) => {
                // If "checklist" collection doesn't exist, create items based on "details" collection
                if (checklistSnapshot.empty) {
                    db.collection("orders").doc("d716BHinTx1rHwR96KOV").collection("queue").doc(itemDoc.id).collection("details").get().then((detailsSnapshot) => {
                        detailsSnapshot.forEach((detailDoc) => {
                            const detailData = detailDoc.data();
                            const dish = detailData.dish;
                            const qty = detailData.qty;

                            // Create item in "checklist" collection for each qty
                            for (let i = 0; i < qty; i++) {
                                db.collection("orders").doc("d716BHinTx1rHwR96KOV").collection("queue").doc(itemDoc.id).collection("checklist").add({
                                    dish: dish,
                                    status: "incomplete"
                                }).then((docRef) => {
                                    console.log("Item added to checklist with ID: ", docRef.id);
                                }).catch((error) => {
                                    console.error("Error adding item to checklist: ", error);
                                });
                            }
                        });
                    }).catch((error) => {
                        console.error("Error getting documents from details collection: ", error);
                    });
                } else {
                    checklistSnapshot.forEach((checklistDoc) => {
                        const checklistData = checklistDoc.data();
                        if (checklistData.status === "completed") {
                            completed++;
                        } else {
                            pending++;
                        }
                    });

                    // Generate table row
                    count++;
                    generateRow(tableID, customerID, completed, pending, status, itemDoc.id, count);
                }
            }).catch((error) => {
                console.error("Error checking if checklist collection exists: ", error);
            });
        });
    }).catch((error) => {
        console.log("Error getting documents: ", error);
    });
};

// Function to generate table row
const generateRow = (tableID, customerID, completed, pending, status, itemID, count) => {
    const row = `
        <tr id="${count}">
            <td>${tableID}</td>
            <td>${customerID}</td>
            <td>${completed}</td>
            <td>${pending}</td>
            <td>${status}</td>
            <td><button class="btn btn-sm btn-success list-button" id="${itemID}" onclick="getChecklist('${itemID}', '${customerID}', ${count})">View</button></td>
        </tr>
    `;
    tableList.innerHTML += row;
};
// Function to handle getting checklist items
function getChecklist(itemId, customerID, rowId){
    const currentRow = document.getElementById(rowId);
    // Update counts in column number 3 and 4 of the current row
    let column3Value = currentRow.cells[2].textContent;
    let column4Value = currentRow.cells[3].textContent;
    console.log("Column 3 value:", column3Value);
    console.log("Column 4 value:", column4Value);

    const customerIdContainer = document.querySelector('.customer-id');
    // Clear existing checklist items
    const checklistItemsContainer = document.getElementById('checklist-items');
    checklistItemsContainer.innerHTML = `
        <div class="row mb-2">
            <div class="col-6 list-item p-0"><b class="h6">Dishname</b></div>
            <div class="col-6 list-item p-0"><b class="h6">Actions</b></div>
        </div>
    `;

    // Retrieve checklist items for the given itemId
    db.collection("orders").doc("d716BHinTx1rHwR96KOV").collection("queue").doc(itemId).collection("checklist").get().then((checklistSnapshot) => {
        // Convert snapshot to array for sorting
        const checklistItems = [];
        checklistSnapshot.forEach((checklistDoc) => {
            const checklistData = checklistDoc.data();
            checklistItems.push({ id: checklistDoc.id, ...checklistData });
        });

        // Sort checklist items by dish name
        checklistItems.sort((a, b) => {
            const dishA = a.dish.toLowerCase();
            const dishB = b.dish.toLowerCase();
            if (dishA < dishB) return -1;
            if (dishA > dishB) return 1;
            return 0;
        });

        let allChecked = true; // Flag to track if all checklist items are checked

        // Display sorted checklist items
        checklistItems.forEach((checklistItem) => {
            const dish = checklistItem.dish;
            const status = checklistItem.status;
            // Create checkbox element
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'checklist-item-checkbox';
            checkbox.value = dish;
            checkbox.checked = status === 'completed'; // If status is completed, checkbox is checked

            // Add event listener to checkbox for status update
            checkbox.addEventListener('change', () => {
                const isChecked = checkbox.checked;
                    if(isChecked){
                        column3Value = parseInt(column3Value) + 1;
                        currentRow.cells[2].textContent = column3Value;
                        column4Value = parseInt(column4Value) - 1;
                        currentRow.cells[3].textContent = column4Value;
                    } else{
                        column3Value = parseInt(column3Value) - 1;
                        currentRow.cells[2].textContent = column3Value;
                        column4Value = parseInt(column4Value) + 1;
                        currentRow.cells[3].textContent = column4Value;
                    }
                // Update the status of the checklist item in the database
                db.collection("orders").doc("d716BHinTx1rHwR96KOV").collection("queue").doc(itemId).collection("checklist").doc(checklistItem.id).update({
                    status: isChecked ? 'completed' : 'incomplete'
                }).then(() => {
                    console.log("Checklist item status updated successfully.");
                    // Retrieve updated checklist items after status update
                    return db.collection("orders").doc("d716BHinTx1rHwR96KOV").collection("queue").doc(itemId).collection("checklist").get();
                }).then((updatedChecklistSnapshot) => {
                    // Check if all checklist items are checked
                    const allChecked = updatedChecklistSnapshot.docs.every(item => item.data().status === 'completed');
                    // Update the status of the parent item based on all checklist items' status
                    const parentStatus = allChecked ? 'completed' : 'pending';
                    
                    if (allChecked){
                        currentRow.cells[4].textContent = 'completed';
                    } else {
                        currentRow.cells[4].textContent = 'pending';
                    }
                    return db.collection("orders").doc("d716BHinTx1rHwR96KOV").collection("queue").doc(itemId).update({
                        status: parentStatus
                    });
                }).then(() => {
                    console.log(`Parent item status updated.`);
                }).catch((error) => {
                    console.error("Error updating status: ", error);
                });
            });


            // Create div to hold checkbox and dish name
            const checklistItemDiv = document.createElement('div');
            checklistItemDiv.className = 'row mb-2';
            checklistItemDiv.innerHTML = `
                <div class="col-6 list-item p-0">${dish}</div>
                <div class="col-6 list-item p-0"></div>
            `;
            checklistItemDiv.lastElementChild.appendChild(checkbox);

            // Append checklist item to container
            checklistItemsContainer.appendChild(checklistItemDiv);
        });

    }).catch((error) => {
        console.error("Error getting checklist items: ", error);
    });

    // Display customer ID
    const changeId = `
        <h6><b>Customer ID - ${customerID}</b></h6>
    `;
    customerIdContainer.innerHTML = changeId;
};



populateTable();
