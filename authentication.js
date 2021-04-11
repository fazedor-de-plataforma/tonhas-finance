async function authenticate() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:5000/authenticate", {
    body: JSON.stringify({ email, password }),
    headers: {
        'Content-type': 'application/json',
    },
    method: "POST"
    }).then((data) => data.json()).then((data) => {
        sessionStorage.setItem("userId", String(data.id));
        window.location.href = "/finanças.html";
    }).catch((err) => {
        const errorElement = document.getElementById("error");
        errorElement.innerText = "Credenciais Inválidas"
    });
}

async function createAccount() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:5000/user", {
    body: JSON.stringify({ name,email,password }),
    headers: {
        'Content-type': 'application/json',
    },
    method: "POST"
    }).then((data) => data.json()).then((data) => {
        sessionStorage.setItem("userId", String(data.user._id));
        window.location.href = "/finanças.html";
    });
}