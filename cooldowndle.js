let attempts = 0;

function intialize() {
    let abilities = document.getElementById("data").innerHTML.split("\n");
    let index = Math.floor(Math.random() * (abilities.length-1));
    console.log(abilities.length);
    let [name, cd] = abilities[index].split(";");
    let image = document.createElement("img");
    image.src = "icons/" + name + ".png";
    document.getElementById("image").append(image);
    
}

function confirm() {
    let guess = document.getElementById("input").value;
    if (+guess == guess) {
        let list = document.querySelectorAll(".guess");
        list[attempts].innerText = guess;
        attempts++;
    }
    
}

intialize();