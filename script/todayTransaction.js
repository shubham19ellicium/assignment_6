let PAGE_COUNT = 10
let PAGE_NUMBER = 1
let PAGE_END_INDEX = '';

var WRAPPER = document.getElementById("table-wrapper-id")

var STORE_ARRAY = []

document.addEventListener("DOMContentLoaded", function() {
    var selectedValue = document.getElementById("select-option-id");
    console.log("RUN AFTER RELOAD");
    console.log("SESSION LOG :: ",sessionStorage.getItem("page-total-list"));
    console.log("PAGE NUMBER :: ",sessionStorage.getItem("page-number"));
    console.log("PAGE COUNT :: ",sessionStorage.getItem("page-count"));
    if (sessionStorage.getItem("page-number") != null && sessionStorage.getItem("page-count") != null) {
        PAGE_NUMBER = parseInt(sessionStorage.getItem("page-number"), 10)
        PAGE_COUNT = parseInt(sessionStorage.getItem("page-count"), 10)
        selectedValue.value = parseInt(sessionStorage.getItem("page-total-list"), 10)
        selectedValue.options[selectedValue.selectedIndex].text = sessionStorage.getItem("page-total-list")
        sessionStorage.removeItem("page-number")
        sessionStorage.removeItem("page-count")
        sessionStorage.removeItem("page-total-list")
    }
});

let USER_NAME_SESSION = sessionStorage.getItem("username")

var responseJsonLength

if (USER_NAME_SESSION === null || USER_NAME_SESSION.length === 0) {
    window.location.href = "index.html";
}

const fetchTransactionData = async () => {
    const response = await fetch(`http://localhost:3000/expense?username=${USER_NAME_SESSION}&date=${todaysDate()}`);
    const jsonData = await response.json();
    console.log("JSON :: ", jsonData);

    PAGE_END_INDEX = Math.ceil(jsonData.length / PAGE_COUNT)
    responseJsonLength = jsonData.length

    while (WRAPPER.lastChild) {
        WRAPPER.removeChild(WRAPPER.lastChild);
    }

    while (STORE_ARRAY.length > 0) {
        STORE_ARRAY.pop();
    }

    jsonData.map((data) => {
        STORE_ARRAY.push(data)
    })





    renderDataFromArray()


    // return jsonData;
};

const fetchSortedData = async (table_col, method) => {
    const response = await fetch(`http://localhost:3000/expense?_sort=${table_col}&_order=${method}&username=${USER_NAME_SESSION}&date=${todaysDate()}`)
    const responseData = await response.json()
    console.log("MAIN SORT DATA :: ", responseData);
    responseJsonLength = responseData.length
    while (WRAPPER.lastChild) {
        WRAPPER.removeChild(WRAPPER.lastChild);
    }

    while (STORE_ARRAY.length > 0) {
        STORE_ARRAY.pop();
    }

    responseData.map((data) => {
        STORE_ARRAY.push(data)
    })
    renderDataFromArray()
}

function renderDataFromArray() {

    while (WRAPPER.lastChild) {
        WRAPPER.removeChild(WRAPPER.lastChild);
    }

    STORE_ARRAY.map((data, index) => {
        index += 1;
        var startIndex = (PAGE_NUMBER * PAGE_COUNT) - (PAGE_COUNT - 1);
        var endIndex = (PAGE_NUMBER * PAGE_COUNT);
        if (index >= startIndex && index <= endIndex) {
            WRAPPER.append(createHtml(data));
        }
    });

    updateIndex()
}

function updateIndex() {
    var currentIndexId = document.getElementById("span-current-page-id")
    var endIndexId = document.getElementById("span-end-page-id")
    PAGE_END_INDEX = Math.ceil(responseJsonLength / PAGE_COUNT)
    console.log("PAGE INDEX :: ", PAGE_END_INDEX);
    currentIndexId.innerHTML = PAGE_NUMBER
    endIndexId.innerHTML = PAGE_END_INDEX
}

function createHtml(data) {
    let td = document.createElement('tr');
    td.innerHTML = `

    <tr>
        <td>${data.description}</td>
        <td>${data.amount}</td>
        <td>${data.date}</td>
        <td>${data.category}</td>
        <td style="text-align: center;">
            <img class="icon-image" onclick="handleEdit(${data.id})" src="../assets/images/editing.png" alt=""></img>
        </td>
        <td style="text-align: center;">
            <img class="icon-image" onclick="handleDelete(${data.id})" src="../assets/images/delete.png" alt=""></img>
        </td>
    </tr>
    
    `;
    return td;
}

function handleEdit(id) {
    console.log("EDIT ID :: ", id);
}

function handleDelete(id) {
    console.log("DELETE ID :: ", id);
    var selectedValue = document.getElementById("select-option-id").value;
    sessionStorage.setItem("page-number", PAGE_NUMBER)
    sessionStorage.setItem("page-count", PAGE_COUNT)
    sessionStorage.setItem("page-total-list", selectedValue)
    fetch("http://localhost:3000/expense/" + id, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }

    }).then(data => {
        console.log("RESPONSE DATA :: ", data.status)
        if (data.status == 200) {
            document.getElementById("popup-delete").style.display = "block";
            setTimeout(closePopup, 3000);
        }
    })
}

function closePopup() {
    document.getElementById("popup-delete").style.display = "none";
    location.reload();
}

function incrementPage() {
    document.getElementById("table-id").scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    if (parseInt(PAGE_NUMBER) < parseInt(PAGE_END_INDEX)) {
        PAGE_NUMBER += parseInt(1)
    }
    renderDataFromArray()
    updateIndex()
}

function decrementPage() {
    document.getElementById("table-id").scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    if (Number(PAGE_NUMBER) > Number(1)) {   // change it to parseInt
        PAGE_NUMBER -= 1
    }
    renderDataFromArray()

    updateIndex()
}

let descriptionFlag = 0
let amountFlag = 0
let dateFlag = 0
let categoryFlag = 0

function handleDataSort(param) {
    let arrow1 = document.getElementById("arr1")
    let arrow2 = document.getElementById("arr2")
    let arrow3 = document.getElementById("arr3")
    let arrow4 = document.getElementById("arr4")

    switch (param) {
        case 1:
            descriptionFlag += 1
            arrow2.classList.remove("active")
            arrow3.classList.remove("active")
            arrow4.classList.remove("active")

            arrow2.style.transform = `rotate(${0}deg)`;
            arrow3.style.transform = `rotate(${0}deg)`;
            arrow4.style.transform = `rotate(${0}deg)`;

            amountFlag = 0
            dateFlag = 0
            categoryFlag = 0

            if (descriptionFlag == 1) {
                arrow1.classList.add("active")
                fetchSortedData("description", "asc")
            } else if (descriptionFlag == 2) {
                var rotation = 180;
                arrow1.style.transform = `rotate(${rotation}deg)`;
                fetchSortedData("description", "desc")
            } else if (descriptionFlag == 3) {
                var rotation = 0;
                arrow1.style.transform = `rotate(${rotation}deg)`;
                arrow1.classList.remove("active")
                descriptionFlag = 0
                fetchTransactionData()
            }
            break

        case 2:
            amountFlag += 1
            arrow1.classList.remove("active")
            arrow3.classList.remove("active")
            arrow4.classList.remove("active")

            arrow1.style.transform = `rotate(${0}deg)`;
            arrow3.style.transform = `rotate(${0}deg)`;
            arrow4.style.transform = `rotate(${0}deg)`;

            descriptionFlag = 0
            dateFlag = 0
            categoryFlag = 0

            if (amountFlag == 1) {
                arrow2.classList.add("active")
                fetchSortedData("amount", "asc")
            } else if (amountFlag == 2) {
                var rotation = 180;
                arrow2.style.transform = `rotate(${rotation}deg)`;
                fetchSortedData("amount", "desc")
            } else if (amountFlag == 3) {
                var rotation = 0;
                arrow2.style.transform = `rotate(${rotation}deg)`;
                arrow2.classList.remove("active")
                amountFlag = 0
                fetchTransactionData()
            }
            break

        case 3:
            dateFlag += 1
            arrow1.classList.remove("active")
            arrow2.classList.remove("active")
            arrow4.classList.remove("active")

            arrow1.style.transform = `rotate(${0}deg)`;
            arrow2.style.transform = `rotate(${0}deg)`;
            arrow4.style.transform = `rotate(${0}deg)`;

            descriptionFlag = 0
            amountFlag = 0
            categoryFlag = 0

            if (dateFlag == 1) {
                arrow3.classList.add("active")
                fetchSortedData("date", "asc")
            } else if (dateFlag == 2) {
                var rotation = 180;
                arrow3.style.transform = `rotate(${rotation}deg)`;
                fetchSortedData("date", "desc")
            } else if (dateFlag == 3) {
                var rotation = 0;
                arrow3.style.transform = `rotate(${rotation}deg)`;
                arrow3.classList.remove("active")
                dateFlag = 0
                fetchTransactionData()
            }
            break

        case 4:
            categoryFlag += 1
            arrow1.classList.remove("active")
            arrow2.classList.remove("active")
            arrow3.classList.remove("active")

            arrow1.style.transform = `rotate(${0}deg)`;
            arrow2.style.transform = `rotate(${0}deg)`;
            arrow3.style.transform = `rotate(${0}deg)`;

            descriptionFlag = 0
            amountFlag = 0
            dateFlag = 0

            if (categoryFlag == 1) {
                arrow4.classList.add("active")
                SORTING_COUNTER = true
                fetchSortedData("category", "asc")
            } else if (categoryFlag == 2) {
                var rotation = 180;
                arrow4.style.transform = `rotate(${rotation}deg)`;
                fetchSortedData("category", "desc")
            } else if (categoryFlag == 3) {
                var rotation = 0;
                arrow4.style.transform = `rotate(${rotation}deg)`;
                arrow4.classList.remove("active")
                categoryFlag = 0
                fetchTransactionData()
            }
            break
    }
}

function handleSelectionChange() {
    var selectedValue = document.getElementById("select-option-id").value;
    PAGE_NUMBER = 1
    PAGE_COUNT = selectedValue
    fetchTransactionData()
}

let toggleFlag = false
function handleToggleButton() {
    toggleFlag = !toggleFlag
    console.log("TOGGLE FLAG :: ",toggleFlag);
    if (toggleFlag === true) {
        fetchTodaysData()
    }
}


function todaysDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var day = new Date(`${yyyy}-${mm}-${dd}`).toLocaleDateString('en-CA')
    return day
}

fetchTransactionData()