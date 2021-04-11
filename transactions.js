function updateSummaryValues(summaryData, pending) {
    const gains = document.getElementById("entradas");
    const loses = document.getElementById("saidas");
    const total = document.getElementById("total");

    if(pending) {
        let baseGainValue = parseFloat(gains.innerHTML.split("R$")[1].replace(",","."));
        let baseLosesValue = parseFloat(loses.innerHTML.split("R$")[1].replace(",","."));
        let baseTotalValue = 0;
        
        if(summaryData.amount < 0) baseLosesValue += Math.abs(summaryData.amount);
        else if(summaryData.amount > 0) baseGainValue += Math.abs(summaryData.amount);

        baseTotalValue = baseGainValue - baseLosesValue;

        gains.innerHTML = `R$ ${baseGainValue.toFixed(2).replace(".",",")}`
        loses.innerHTML = `R$ ${baseLosesValue.toFixed(2).replace(".",",")}`
        total.innerHTML = `R$ ${baseTotalValue.toFixed(2).replace(".",",")}`

    } else {
        console.log("entrou")
        gains.innerHTML = "R$ " + summaryData.gains.toFixed(2).replace(".",",");
        loses.innerHTML = "R$ " + summaryData.loses.toFixed(2).replace(".",",");
        total.innerHTML = "R$ " + summaryData.total.toFixed(2).replace(".",",");
    }
}

function renderTransaction({ _id, description, amount, evaluateDate }) {
    if(amount) {
        const tr = document.createElement("tr");
    
        const parts = new Date(evaluateDate).toISOString().split("T")[0].split("-")
        const formattedDate = parts[2] + "/" + parts[1] + "/" +parts[0];
    
        tr.innerHTML = `
            <th id="descripton">${description}</th>
            <th id="${amount < 0 ? "expensive": "income"}" class="value">R$ ${Math.abs(amount).toFixed(2).replace(".",",")}</th>
            <th id="date">${formattedDate}</th>
            <th id="image"><img src="imagens-do-site/assets/minus.svg" onclick="deleteTransaction(\ '${_id.toString()}' \)" id="deletor" alt=""></th>`;
        tr.classList = 'tr'           
        table.appendChild(tr)
    }
}

async function getTransactions() {
    fetch("http://localhost:5000/transactions", {
        headers: {
            'Content-type': 'application/json',
            'userid': sessionStorage.getItem("userId")
        },
        method: "GET"
    })
    .then((data) => data.json())
    .then((data) => {
        data.transactions.forEach((transaction) => renderTransaction(transaction));
        updateSummaryValues(data.summaryData)
        document.getElementById('overlow').classList.remove('s');
    })
    .catch((err) => console.error(err))
}

async function createTransaction() {
    const description = document.querySelector("input#description").value
    const amount = document.querySelector("input#value").value
    const evaluateDate = document.querySelector("input#date").value

    fetch("http://localhost:5000/transaction", {
        body: JSON.stringify({ description, amount, evaluateDate }),
        headers: {
            'Content-type': 'application/json',
            'userid': sessionStorage.getItem("userId")
        },
        method: "POST"
    })
    .then((data) => data.json())
    .then((data) => {
        renderTransaction(data.transaction)
        updateSummaryValues(data.transaction, true)
        document.getElementById('overlow').classList.remove('s')
    })
    .catch((err) => console.error(err));
}

async function deleteTransaction(id) {
    fetch("http://localhost:5000/transaction/" + id, {
        headers: { 'Content-type': 'application/json' },
        method: "DELETE"
    }).then((data) => {
        window.location.reload()
    }).catch((err) => console.error(err));
}