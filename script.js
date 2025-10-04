
const root = document.getElementsByClassName("root")[0];

const newButton = document.createElement("button");
newButton.textContent = "CLICK !! ME !!!";
root.appendChild(newButton);

let btn = document.querySelector("button");

btn.onclick = () => {
    root.innerHTML = "";
    const heading = document.createElement("h1");
    heading.textContent = "TA-DA!";
    root.appendChild(heading);
};