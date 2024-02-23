let AMOUNT_INPUT = document.getElementById("amount-id")
let AMOUNT_INPUT_ERROR = document.getElementById("amount-error-id")
let NAME_INPUT = document.getElementById("name-id")
let NAME_INPUT_ERROR = document.getElementById("name-error-id")
let DATE_INPUT = document.getElementById("date-input")
let DATE_INPUT_ERROR = document.getElementById("date-error-id")
let SELECT_CAT_INPUT = document.getElementById("select-category-id")
let SELECT_CAT_INPUT_ERROR = document.getElementById("select-category-error-id")

let USER_NAME_SESSION = sessionStorage.getItem("username")

let POPUP_BLOCK = document.getElementById("popup-delete")
let POPUP_MESSAGE_TEXT_BLOCK = document.getElementById("message-text-id")
let POPUP_IMAGE_BLOCK = document.getElementById("popup-image-id")

let DISPLAY_MONTH_TOTAL = document.getElementById("amount-display-id")
let DISPLAY_DAY_TOTAL = document.getElementById("amount-day-display-id")

document.getElementById("level-id-1").style.backgroundColor = "#c4e4ef"

if (USER_NAME_SESSION === null || USER_NAME_SESSION.length === 0) {
    window.location.href = "index.html";
}

const checkUser = async () => {
    console.log("USERSESSION :: ", USER_NAME_SESSION);
    const response = await fetch(`http://localhost:3000/user?username=${USER_NAME_SESSION}`);
    const jsonData = await response.json();
    console.log("DATA ::---> ", jsonData);
    if (jsonData.length === 0) {
        window.location.href = "index.html";
    }
}

checkUser()

function digitCheck(input) {
    var reg = /^\d+$/;
    if (reg.test(input) === true) {
        return true
    } else {
        return false
    }
}

// function nameCheck(input){
//     var regex = /^[A-Za-z0-9\s]+$/;
//     if (regex.test(input) === true){
//         return true
//     }else{
//         return false
//     }
// }

function todaysDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var day = new Date(`${yyyy}-${mm}-${dd}`).toLocaleDateString('en-CA')
    return day
}

AMOUNT_INPUT.addEventListener("keyup", (e) => {
    if (e.target.value) {
        var alphabetPressed = digitCheck(e.target.value)
    }
    if (alphabetPressed === false) {
        AMOUNT_INPUT_ERROR.innerText = "Only number allowed"
    } else if (e.target.value.length === 0) {
        AMOUNT_INPUT_ERROR.innerText = "Field required"
    } else if (e.target.value.length >= 6) {
        AMOUNT_INPUT_ERROR.innerText = "Reached max limit"
    } else {
        AMOUNT_INPUT_ERROR.innerText = ""
    }
    // e.target.value = e.target.value.replace(/\D/g, '');
});

NAME_INPUT.addEventListener("keyup", (e) => {
    // if (e.target.value) {
    //     var alphabetPressed = nameCheck(e.target.value)
    // }

    if (e.target.value.length === 0) {
        NAME_INPUT_ERROR.innerText = "Field required"
    } else if (e.target.value.length === 50) {
        NAME_INPUT_ERROR.innerText = "Reached Max Limit"
        setTimeout(() => {
            NAME_INPUT_ERROR.innerText = ""
        }, 1000)
    } else {
        NAME_INPUT_ERROR.innerText = ""
    }
})

DATE_INPUT.addEventListener("input", (e) => {
    let selectedDate = new Date(e.target.value)
    let todayDate = todaysDate()
    if (selectedDate.toLocaleDateString('en-CA') > todayDate) {
        DATE_INPUT_ERROR.innerText = "Date should not be in future"
    } else {
        DATE_INPUT_ERROR.innerText = ""
    }
})

SELECT_CAT_INPUT.addEventListener("input", (e) => {
    console.log("e : ", e.target.value);
    if (e.target.value === "none") {
        SELECT_CAT_INPUT_ERROR.innerText = "Please select category"
    } else {
        SELECT_CAT_INPUT_ERROR.innerText = ""
    }
})

function handleUploadData() {
    event.preventDefault();

    var value = SELECT_CAT_INPUT.value;
    var text = SELECT_CAT_INPUT.options[SELECT_CAT_INPUT.selectedIndex].text;
    if (value === "none") {
        SELECT_CAT_INPUT_ERROR.innerText = "Please select category"
        return
    }

    console.log("AFTER WORK");
    let selectedDate = new Date(DATE_INPUT.value).toLocaleDateString('en-CA')
    const isNameValid = NAME_INPUT.value.trim() !== "";
    const isAmountValid = AMOUNT_INPUT.value.trim() !== "";
    const isAmountGreaterThenZero = AMOUNT_INPUT.value < 0
    const isDateValid = selectedDate > todaysDate()
    const isCategory = value === "none"

    console.log("isNameValid :: ", isNameValid);
    console.log("isAmountValid :: ", isAmountValid);
    console.log("inAmountGreaterThenZero :: ", isAmountGreaterThenZero);
    console.log("isDateValid :: ", isDateValid);
    console.log("isCategory :: ", isCategory);

    if (isNameValid === true && isAmountValid === true && isAmountGreaterThenZero == false && isDateValid == false && isCategory == false) {
        fetch("http://localhost:3000/expense", {
            method: "POST",
            body: JSON.stringify({
                description: NAME_INPUT.value.trim(),
                amount: parseInt(AMOUNT_INPUT.value.trim()),
                date: selectedDate,
                category: SELECT_CAT_INPUT.value,
                username: USER_NAME_SESSION
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(data => {
            console.log("STATUS :: ", data.status);
            console.log("DATA   :: ", data);
            if (data.status == 201) {
                POPUP_BLOCK.style.display = "block";
                POPUP_MESSAGE_TEXT_BLOCK.innerText = "Data added successfully"
                POPUP_IMAGE_BLOCK.src = "../assets/images/checked.png"
                setTimeout(closePopup, 3000);
            }
        }).catch((error) => {
            POPUP_BLOCK.style.display = "block";
            POPUP_MESSAGE_TEXT_BLOCK.innerText = `Error : ${error.message} data`
            POPUP_IMAGE_BLOCK.src = "../assets/images/remove.png"
            setTimeout(closePopup, 3000);
        })
    } else {
        return
    }

}

const fetchDataForThisMonth = async () => {
    let dates = getStartDateAndEndDate()
    const response = await fetch(`http://localhost:3000/expense?username=${USER_NAME_SESSION}&date_gte=${dates.firstDay}&date_lte=${dates.lastDay}`);  // http://localhost:3000/expense?date_gte=2024-02-20&date_lte=2024-02-22
    const jsonData = await response.json();

    let totalValue = jsonData.reduce((holder, current) => {
        let sum = holder + current.amount
        return sum
    }, 0)

    DISPLAY_MONTH_TOTAL.innerText = formatNumberToPrice(totalValue)
}

fetchDataForThisMonth()

const fetchDataForCurrentDay = async () => {
    const response = await fetch(`http://localhost:3000/expense?username=${USER_NAME_SESSION}&date=${todaysDate()}`);  // http://localhost:3000/expense?date_gte=2024-02-20&date_lte=2024-02-22
    // const response = await fetch(`http://localhost:3000/expense?username=${USER_NAME_SESSION}&date=${todaysDate()}&_sort=id&_order=desc`);
    const jsonData = await response.json();
    console.log("JSON :: ", jsonData);

    let totalValue = jsonData.reduce((holder, current) => {
        let sum = holder + current.amount
        return sum
    }, 0)

    DISPLAY_DAY_TOTAL.innerText = formatNumberToPrice(totalValue)
}

fetchDataForCurrentDay()

function getStartDateAndEndDate() {

    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('en-CA');
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleDateString('en-CA');
    return {
        firstDay,
        lastDay
    }
}

function closePopup() {
    POPUP_BLOCK.style.display = "none";
    location.reload();
}

function formatNumberToPrice(number) {
    var format = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 1,
    });

    return format.format(number)
}

function handleLogout() {
    sessionStorage.clear()
    window.location.href = "index.html";

}

var chart = am4core.create("chartdiv", am4charts.XYChart);

const fetchCompleteData = async () => {
    const response = await fetch(`http://localhost:3000/expense?username=${USER_NAME_SESSION}&_sort=id&_order=desc`);
    const jsonData = await response.json();
    console.log("DATA :: ", jsonData);

    var n = jsonData.map(data => {
        var obj = data
        obj.date = getMonthFromDay(data.date)
        return obj
    })

    const monthlyTotals = [];

    // n.map((element) => {
    //     let {date,amount} = element
    //     let foundFlag = false
    //     for (let index = 0; index < monthlyTotals.length; index++) {
    //         if(monthlyTotals[index].date === date){
    //             monthlyTotals[index].amount += amount
    //             foundFlag = true
    //             break;
    //         }
    //     }
    //     if (foundFlag === false) {
    //         monthlyTotals.push({ date, amount });
    //     }
    // })

    // -----------------------------------------------------
    n.forEach((element) => {
        let { date, amount } = element
        let foundFlag = false

        // let find = monthlyTotals.find(o => o.date === date);
        // let index = monthlyTotals.indexOf(find)
        // let include = monthlyTotals.includes(find)

        let include = monthlyTotals.findIndex((arrayData,index) =>{
            return arrayData.date === date
        })


        if(include >= 0){
            monthlyTotals[include].amount += amount
            foundFlag = true
        }

        if (foundFlag === false) {
            monthlyTotals.push({ date, amount });
        }

    })

    console.log("MONTH :: ",monthlyTotals);
    // -----------------------------------------------------


    // -----------------------------------------------------
    // obj.hasOwnProperty("key")
    // let obj = {}
    // n.map((element) => {
    //     var newObj = {}
    //     let {date,amount} = element
    //     console.log("LOG :: ",obj.date);
    //     if(obj.date === date){
    //         obj.amount += amount
    //     }else{
    //         newObj['date'] = date
    //         newObj['amount'] = amount
    //         obj ={...obj,newObj}
    //     }
    // })
    // console.log("OBJ ::---> ",obj);
    // console.log(monthlyTotals)
    // -----------------------------------------------------

    createChart(monthlyTotals)
}

fetchCompleteData()

function getMonthFromDay(date) {
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let monthFlag = new Date(date).getMonth()
    return month[monthFlag]
}


function createChart(data) {

    chart.data = data

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "date";
    categoryAxis.title.text = "Month";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Total amount spent";

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "amount";
    series.dataFields.categoryX = "date";
    series.name = "Expense";
    series.columns.template.tooltipText = "Series: {name}\nMonth: {categoryX}\nAmount: {valueY}";
    series.columns.template.fill = am4core.color("#104547");

}