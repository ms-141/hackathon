// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // ===== SHARED FUNCTIONALITY (works on all pages) =====

    // Array of entries (shared across pages)
    let arrayOfEntries = [];

    // Function to retrieve and log user from localStorage
    function getUserFromStorage(userName) {
        let user = JSON.parse(localStorage.getItem(userName));
        console.log(`Retrieved user '${userName}':`, user);
        return user;
    }

    // Function to get all entries for a specific user
    function getAllUserEntries(userName) {
        let userEntries = JSON.parse(localStorage.getItem(`${userName}_entries`)) || [];
        console.log(`All entries for '${userName}':`, userEntries);
        return userEntries;
    }

    // Function to add entry to user's collection
    function addEntryToUser(userName, entryData) {
        let userEntries = getAllUserEntries(userName);
        userEntries.push(entryData);
        localStorage.setItem(`${userName}_entries`, JSON.stringify(userEntries));
        console.log(`Added entry for '${userName}':`, entryData);
        return userEntries;
    }

    // Function to display all entries for a user
    function displayUserEntries(userName, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const userEntries = getAllUserEntries(userName);
        container.innerHTML = ''; // Clear previous content

        if (userEntries.length === 0) {
            container.innerHTML = '<p>No entries found for this user.</p>';
            return;
        }

        userEntries.forEach((entry, index) => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'user-entry';
            entryDiv.innerHTML = `
                <h3>Entry ${index + 1}</h3>
                <p><strong>Date:</strong> ${entry.date}</p>
                <p><strong>Location:</strong> ${entry.location}</p>
                <p><strong>Entry:</strong> ${entry.entry}</p>
                <hr>
            `;
            container.appendChild(entryDiv);
        });
    }

    // Journal Object Creator
    function createEntry(name, date, entry, imageFile) {
        return {
            name: name,
            date: date,
            entry: entry,
            imageFile: imageFile
        }
    }

    // Show all stored users
    console.log('All localStorage keys:', Object.keys(localStorage));


    // ===== INDEX.HTML SPECIFIC FUNCTIONALITY =====

    const root = document.getElementsByClassName("root")[0];

    // Only run this code if we're on a page that has the "root" element
    if (root) {
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
    }

    // Form functionality (only if form exists)
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', function (event) {
            event.preventDefault(); // prevent default form submission

            const form = new FormData(event.target);
            const name = form.get('user');
            const date = form.get('date');
            const location = form.get('location');
            const entry = form.get('entry');
            const imageFile = form.get('myImage');

            console.log("Name:", name);
            console.log("Date:", date);
            console.log("Entry:", entry);
            console.log("Image:", imageFile);

            // Create and add entry to array
            const newEntry = createEntry(name, date, location, entry, imageFile);
            arrayOfEntries.push(newEntry);
            console.log('Entry added to array:', newEntry);
            console.log('Updated array:', arrayOfEntries);

            // Store individual entry in localStorage (old method)
            localStorage.setItem(name, JSON.stringify(newEntry));

            // Store in user's collection (new method)
            const updatedEntries = addEntryToUser(name, {
                date: date,
                location: location,
                entry: entry,
                timestamp: new Date().toISOString()
            });

            console.log('All entries for this user:', updatedEntries);

            // Handle image preview if file exists
            if (imageFile && imageFile.size > 0) {
                //creating a tempURL
                const tempURL = URL.createObjectURL(imageFile);

                const imagePreview = document.getElementById('imagePreview')
                if (imagePreview) {
                    imagePreview.src = tempURL;
                    imagePreview.style.display = 'block';
                }
            }
        });
    }


    // ===== DASHBOARD.HTML SPECIFIC FUNCTIONALITY =====

    const nameEntry = document.getElementById("nameEntry");

    // Only run this code if we're on a page that has the "nameEntry" element
    if (nameEntry) {
        nameEntry.addEventListener('input', function (event) {
            const inputValue = event.target.value.trim();

            // Save to localStorage
            localStorage.setItem("userName", inputValue);

            // Get the first element with class 'userEntries'
            const entriesContainer = document.getElementsByClassName("userEntries")[0];

            if (entriesContainer && inputValue !== '') {
                //all entries for this user
                displayUserEntries(inputValue, 'userEntriesDisplay');

                //simple list in the original container
                entriesContainer.innerHTML = '';
                const userEntries = getAllUserEntries(inputValue);

                if (userEntries.length > 0) {
                    const summary = document.createElement("div");
                    summary.innerHTML = `
                        <h3>User: ${inputValue}</h3>
                        <p>Total entries: ${userEntries.length}</p>
                        <button id='dashboardButton' onclick="showAllEntries('${inputValue}')">Show All Entries</button>`;
                    const dashboardButton = document.getElementById('nameEntry');
                    dashboardButton.addEventListener('click', function () {
                        console.log("entries")
                        const entries = localStorage.getItem(inputValue);
                        entriesContainer.appendChild(entries);
                    })

                    entriesContainer.appendChild(summary);
                } else {
                    const noEntries = document.createElement("div");
                    noEntries.textContent = `No entries found for user: ${inputValue}`;
                    entriesContainer.appendChild(noEntries);
                }
            }
        });
    }

    // Global function to show all entries (can be called from button)
    window.showAllEntries = function (userName) {
        const entriesContainer = document.getElementsByClassName("userEntries")[0];
        if (entriesContainer) {
            entriesContainer.innerHTML = '';
            displayUserEntries(userName, entriesContainer.id || 'userEntries');
        }
    }

    // Initial logging
    console.log('Initial array of entries:', arrayOfEntries);

});




