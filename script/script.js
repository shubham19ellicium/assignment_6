let NAME_REGISTER = document.getElementById("name")
let USER_NAME_REGISTER = document.getElementById("username")
let USER_REGISTER_PASSWORD = document.getElementById("psw")
let USER_NAME_REGISTER_ERROR = document.getElementById("username-error-message")

let USER_NAME_SIGN = document.getElementById("username-sign-in")
let USER_SIGN_PASSWORD = document.getElementById("psw-sign-in")

let USER_REGISTER_FORM = document.getElementById("register-id")
let USER_LOGIN_FORM = document.getElementById("login-id")

USER_REGISTER_FORM.classList.add("active")

const findUserByUserName = async(username) => {
    const response = await fetch(`http://localhost:3000/user?username=${username}`)
    const responseData = await response.json();
    return responseData
}

async function handleRegisterForm() {
    event.preventDefault()

    let user = await findUserByUserName(USER_NAME_REGISTER.value)
    if (user.length > 0) {
        USER_NAME_REGISTER_ERROR.innerHTML = "User already exist"
        return
    }else{
        USER_NAME_REGISTER_ERROR.innerHTML = ""
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
            document.getElementById("popup-register").style.display = "block";
            setTimeout(closePopup, 3000);
        }
    }).catch(error => {
        console.log("ERROR :: ", error);
    })


}

function closePopup() {
    document.getElementById("popup-register").style.display = "none";
}

async function handleSignInForm(){
    event.preventDefault()

    let user = await findUserByUserName(USER_NAME_SIGN.value)
    if (user.length === 0) {
        USER_NAME_REGISTER_ERROR.innerHTML = "User not found"
        return
    }else{
        USER_NAME_REGISTER_ERROR.innerHTML = ""
    }

    if (USER_SIGN_PASSWORD.value === user[0].password) {
        console.log("--------- PASSWORD MATCHED ---------");
        sessionStorage.setItem("username",user[0].username)
        window.location.href="dashboard.html";
    }

}

function handleLoadSignInPage(){
    USER_REGISTER_FORM.classList.remove("active")
    USER_LOGIN_FORM.classList.add("active")
}

function handleLoadSignUpPage(){
    USER_REGISTER_FORM.classList.add("active")
    USER_LOGIN_FORM.classList.remove("active")
}