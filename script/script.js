let NAME_REGISTER = document.getElementById("name")
let USER_NAME_REGISTER = document.getElementById("username")
let USER_REGISTER_PASSWORD = document.getElementById("psw")
let USER_REGISTER_PASSWORD_REPEAT = document.getElementById("psw-repeat")
let USER_NAME_REGISTER_ERROR = document.getElementById("username-error-message")
let REPEAT_PASS_REGISTER_ERROR = document.getElementById("repeat-password-error-message")

let USER_NAME_SIGN = document.getElementById("username-sign-in")
let USER_SIGN_PASSWORD = document.getElementById("psw-sign-in")
let USER_NAME_SIGN_ERROR = document.getElementById("username-sign-in-error-message")
let PASSWORD_SIGN_ERROR = document.getElementById("password-sign-in-error-message")

let USER_REGISTER_FORM = document.getElementById("register-id")
let USER_LOGIN_FORM = document.getElementById("login-id")

let POPUP_BLOCK = document.getElementById("popup-delete")
let POPUP_MESSAGE_TEXT_BLOCK = document.getElementById("message-text-id")
let POPUP_IMAGE_BLOCK = document.getElementById("popup-image-id")

let USER_NAME_SESSION = sessionStorage.getItem("username")
if (USER_NAME_SESSION != null && USER_NAME_SESSION.length>0) {
    window.location.href="dashboard.html";
}

USER_LOGIN_FORM.classList.add("active")

const findUserByUserName = async(username) => {
    try {
        const response = await fetch(`http://localhost:3000/user?username=${username}`)
        const responseData = await response.json();
        return responseData
    } catch (error) {
        console.log("ERROR :: ", error);
        POPUP_BLOCK.style.display = "block";
        POPUP_MESSAGE_TEXT_BLOCK.innerText = `Error : ${error.message} data`
        POPUP_IMAGE_BLOCK.src = "../assets/images/remove.png"
        setTimeout(closePopup, 3000);
    }
}

async function handleRegisterForm() {
    event.preventDefault()
    try {
        let user = await findUserByUserName(USER_NAME_REGISTER.value)
    if (user.length > 0) {
        USER_NAME_REGISTER_ERROR.innerHTML = "User already exist"
        return
    }else{
        USER_NAME_REGISTER_ERROR.innerHTML = ""
    }

    if (USER_REGISTER_PASSWORD.value !== USER_REGISTER_PASSWORD_REPEAT.value) {
        console.log("PASSWORD NOT MATCHING WITH REPEAT");
        REPEAT_PASS_REGISTER_ERROR.innerText = "Please enter matching password"
        return
    }else{
        REPEAT_PASS_REGISTER_ERROR.innerText = ""
    }

    fetch("http://localhost:3000/user", {
        method: "POST",
        body: JSON.stringify({
            name: NAME_REGISTER.value.trim(),
            username: USER_NAME_REGISTER.value,
            password: USER_REGISTER_PASSWORD.value,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(data => {
        if (data.status == 201) {
            USER_REGISTER_FORM.reset()
            document.getElementById("popup-register").style.display = "block";
            setTimeout(closePopup, 3000);
        }
    }).catch(error => {
        console.log("ERROR :: ", error);
        POPUP_BLOCK.style.display = "block";
        POPUP_MESSAGE_TEXT_BLOCK.innerText = `Error : ${error.message} data`
        POPUP_IMAGE_BLOCK.src = "../assets/images/remove.png"
        setTimeout(closePopup, 3000);
    })
    } catch (error) {
        console.log("ERROR : ",error);
    }
    


}

function closePopup() {
    document.getElementById("popup-register").style.display = "none";
    POPUP_BLOCK.style.display = "none";
}

async function handleSignInForm(){
    event.preventDefault()

    // try {
        let user = await findUserByUserName(USER_NAME_SIGN.value)
        if (user.length === 0) {
            console.log("USER LENGTH");
            USER_NAME_SIGN_ERROR.innerHTML = "User not found"
            return
        }else{
            USER_NAME_SIGN_ERROR.innerHTML = ""
        }
        if (USER_SIGN_PASSWORD.value === user[0].password) {
            console.log("--------- PASSWORD MATCHED ---------");
            USER_LOGIN_FORM.reset()
            sessionStorage.setItem("username",user[0].username)
            window.location.href="dashboard.html";
        }else{
            PASSWORD_SIGN_ERROR.innerText = "Invalid password"
            return
        }
    // } 
    // catch (error) {
    //     console.log("ERROR :: ", error);
    //     POPUP_BLOCK.style.display = "block";
    //     POPUP_MESSAGE_TEXT_BLOCK.innerText = `Something went wrong`
    //     POPUP_IMAGE_BLOCK.src = "../assets/images/remove.png"
    //     setTimeout(closePopup, 3000);
    // }

}

function handleLoadSignInPage(){
    USER_REGISTER_FORM.classList.remove("active")
    USER_LOGIN_FORM.classList.add("active")
}

function handleLoadSignUpPage(){
    USER_REGISTER_FORM.classList.add("active")
    USER_LOGIN_FORM.classList.remove("active")
}