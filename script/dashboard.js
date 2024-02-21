let AMOUNT_INPUT = document.getElementById("amount-id")
let AMOUNT_INPUT_ERROR = document.getElementById("amount-error-id")
let NAME_INPUT = document.getElementById("name-id")
let NAME_INPUT_ERROR = document.getElementById("name-error-id")
let DATE_INPUT = document.getElementById("date-input")
let DATE_INPUT_ERROR = document.getElementById("date-error-id")
let SELECT_CAT_INPUT = document.getElementById("select-category-id")
let SELECT_CAT_INPUT_ERROR = document.getElementById("select-category-error-id")

let USER_NAME_SESSION = sessionStorage.getItem("username")

if (USER_NAME_SESSION === null || USER_NAME_SESSION.length === 0) {
    window.location.href="index.html";
}

function digitCheck(input){
    var reg = /^\d+$/;
    if (reg.test(input) === true){
        return true
    }else{
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
    if (alphabetPressed === false  ) {
        AMOUNT_INPUT_ERROR.innerText = "Only number allowed"
    }else if (e.target.value.length === 0) {
        AMOUNT_INPUT_ERROR.innerText = "Field required"
    }else{
        AMOUNT_INPUT_ERROR.innerText = ""
    }
    e.target.value = e.target.value.replace(/\D/g, '');
});

NAME_INPUT.addEventListener("keyup",(e) =>{
    // if (e.target.value) {
    //     var alphabetPressed = nameCheck(e.target.value)
    // }
    
    if (e.target.value.length === 0) {
        NAME_INPUT_ERROR.innerText = "Field required"
    }else{
        NAME_INPUT_ERROR.innerText = ""
    }
})

DATE_INPUT.addEventListener("input",(e) =>{
    let selectedDate = new Date(e.target.value)
    let todayDate = todaysDate()
    if (selectedDate.toLocaleDateString('en-CA') > todayDate) {
        DATE_INPUT_ERROR.innerText = "Date should not be in future"
    }else{
        DATE_INPUT_ERROR.innerText = ""
    }
})

SELECT_CAT_INPUT.addEventListener("input",(e) => {
    console.log("e : ",e.target.value);
    if (e.target.value === "none") {
        SELECT_CAT_INPUT_ERROR.innerText = "Please select category"
    }else{
        SELECT_CAT_INPUT_ERROR.innerText = ""
    }
})

function handleUploadData(){
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

    console.log("isNameValid :: ",isNameValid);
    console.log("isAmountValid :: ",isAmountValid);
    console.log("inAmountGreaterThenZero :: ",isAmountGreaterThenZero);
    console.log("isDateValid :: ",isDateValid);
    console.log("isCategory :: ",isCategory);

    if (isNameValid === true && isAmountValid === true && isAmountGreaterThenZero == false && isDateValid == false && isCategory == false) {
        fetch("http://localhost:3000/expense", {
        method: "POST",
        body: JSON.stringify({
            description: NAME_INPUT.value.trim(),
            amount: parseInt(AMOUNT_INPUT.value.trim()),
            date: selectedDate,
            category: SELECT_CAT_INPUT.value,
            username:USER_NAME_SESSION
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(data => {
        console.log("STATUS :: ",data.status);
        console.log("DATA   :: ",data);
        // if (data.status == 201) {
        //     document.getElementById("popup-create").style.display = "block";
        //     setTimeout(closePopup, 3000);
        // }
    }).catch((error) => {
        console.log("SOMETING WENT WRONG :: ",error);
    })
    }else{
        return
    }

}