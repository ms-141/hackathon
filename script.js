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


//get info from the form
document.getElementById('userForm').addEventListener('submit', function (event) {
    event.preventDefault(); // prevent default form submission

    const form = new FormData(event.target);
    const name = form.get('name');
    const date = form.get('date');
    const entry = form.get('entry');

    console.log("Name:", name);
    console.log("Date:", date);
    console.log("Entry:", entry);
});

//image preview logic
document.getElementById('imageUploadForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const form = new FormData(event.target);


    const imageFile = form.get('myImage');

    // Check if a file was actually selected
    if (!imageFile || imageFile.size === 0) {
        console.log('No file selected');
        return;
    }

    const tempURL = URL.createObjectURL(imageFile);

    const imagePreview = document.getElementById('imagePreview')
    imagePreview.src = tempURL;
    imagePreview.style.display = 'block';

    //remove the temporary URL to free up memory
    imagePreview.onload = () => {
        URL.revokeObjectURL(tempURL);
    };

})

