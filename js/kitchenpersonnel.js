const tableList = document.getElementById("list");

const populateTable = () => {
    db.collection("orders").doc("d716BHinTx1rHwR96KOV").collection("queue").get().then((itemSnapshot) => {
        itemSnapshot.forEach((itemDoc) => {
            const itemData = itemDoc.data();
            const tableID = itemData.tableid;
            const customerID = itemData.customerid;
            const status = itemData.status;

            const row =  `
                <tr>
                    <td>${tableID}</td>
                    <td>${customerID}</td>
                    <td>${status}</td>
                    <td><button class="btn btn-sm btn-success list-button" id="${itemDoc.id}" onclick="getDetails('${itemDoc.id}')">Confirm</button></td>
                </tr>
            `

            tableList.innerHTML += row;

        });
    }).catch((error) => {
        console.log("Error getting documents: ", error);
    });
};

populateTable();