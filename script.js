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

// array of entries
let arrayOfEntries = [];


//get info from the form
document.getElementById('userForm').addEventListener('submit', function (event) {
    event.preventDefault(); // prevent default form submission

    const form = new FormData(event.target);
    const name = form.get('user');
    const date = form.get('date');
    const entry = form.get('entry');
    const imageFile = form.get('myImage');

    console.log("Name:", name);
    console.log("Date:", date);
    console.log("Entry:", entry);
    console.log("Image:", imageFile);

    // Create and add entry to array
    const newEntry = createEntry(name, date, entry, imageFile);
    arrayOfEntries.push(newEntry);
    console.log('Entry added to array:', newEntry);
    console.log('Updated array:', arrayOfEntries);

    // Store in localStorage
    localStorage.setItem(name, JSON.stringify(newEntry));
    console.log('Stored in localStorage with key:', name);

    // Handle image preview if file exists
    if (imageFile && imageFile.size > 0) {
        //creating a tempURL
        const tempURL = URL.createObjectURL(imageFile);

        const imagePreview = document.getElementById('imagePreview')
        imagePreview.src = tempURL;
        imagePreview.style.display = 'block';


    }



});


// Journal Object Creator
function createEntry(name, date, entry, imageFile) {
    return {
        name: name,
        date: date,
        entry: entry,
        imageFile: imageFile
    }
}




//logging the array with all the entries when page loads
console.log('Initial array of entries:', arrayOfEntries);

// Function to retrieve and log user from localStorage
function getUserFromStorage(userName) {
    let user = JSON.parse(localStorage.getItem(userName));
    console.log(`Retrieved user '${userName}':`, user);
    return user;
}

// Example: Try to get a user (will be null initially)
let returnUser = 'joe mama';
let user = getUserFromStorage(returnUser);

// Show all stored users
console.log('All localStorage keys:', Object.keys(localStorage));

//made an object
//want to store them

//NEW PAGE 
const entries = document.getElementsByClassName("userEntries")
entries.appendChild(localStorage.getItem(name));
