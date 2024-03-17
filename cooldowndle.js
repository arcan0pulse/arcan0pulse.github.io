let attempts = 0;
let solution = -1;
//TODO: Jax, Elise, Jayce, Asol, Yuumi, Nidalee, Kled, Fizz
function intialize() {
    let abilities = document.getElementById("data").innerHTML.split("\n");
    let index = Math.floor(Math.random() * (abilities.length-1));
    console.log(abilities.length);
    let [name, cooldown] = abilities[index].split(";");
    solution = Number.parseFloat(cooldown);
    console.log(solution);
    let image = document.createElement("img");
    image.src = "icons/" + name + ".webp";
    document.getElementById("image").append(image);
    document.getElementById("abilityname").innerText = name;
    document.getElementById("input").addEventListener(e => confirm());
}

function confirm() {
    let guess = document.getElementById("input").value;
    if (+guess == guess) {
        let textfield = document.querySelectorAll(".guess")[attempts];
        textfield.innerText = guess;
        let arrow = document.querySelectorAll(".arrow")[attempts];
        if (guess < solution)
            arrow.innerText = "↑";
        if (guess > solution)
            arrow.innerText = "↓";
        attempts++;
        if (+guess == solution) {
            victory();
            return;
        }
    }
    if (attempts == 5) defeat();
}

function defeat() {
    endgame();
    document.getElementById("message").innerText = "Defeat"
}

function victory() {
    endgame();
    document.getElementById("message").innerText = "Victory!"
}

function endgame() {
    document.getElementById("confirm").disabled = "true";
}

function disable() {
    return;
}

intialize();