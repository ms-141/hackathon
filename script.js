document.addEventListener('DOMContentLoaded', function () {
    //empty array of entries (shared across pages)
    let arrayOfEntries = [];//creating an array of objects to store all entries

    //function to retrieve and log user from localStorage
    function getUserFromStorage(userName) {
        let user = JSON.parse(localStorage.getItem(userName));//parse over localStorage searching for a user
        console.log('Retrieved user', userName, user); //template literals for debugging
        return user;
    }

    // get all entries for a specific user
    function getAllUserEntries(userName) {
        let userEntries = JSON.parse(localStorage.getItem(userName)) || [];//search 
        console.log(userName, ' ', userEntries);
        return userEntries;
    }

    // Function to add entry to user's collection
    function addEntryToUser(userName, entryData) {
        let userEntries = getAllUserEntries(userName); //collect entries
        userEntries.push(entryData);
        localStorage.setItem(userName, JSON.stringify(userEntries));//update memory with updated all entries
        console.log(userName, entryData);
        return userEntries;
    }

    // Function to display all entries for a user
    function displayUserEntries(userName, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const userEntries = getAllUserEntries(userName);
        container.innerHTML = ''; //Clear previous content

        if (userEntries.length === 0) {
            container.innerHTML = '<p>No entries found for this user.</p>';
            return;
        }

        userEntries.forEach((entry, index) => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'user-entry';
            //creating new html code to create nodes with entries from user 
            entryDiv.innerHTML = `
                <h3>Entry ${index + 1}</h3> 
                <p><strong>Date:</strong> ${entry.date}</p>
                <p><strong>Location:</strong> ${entry.location}</p>
                <p><strong>Entry:</strong> ${entry.entry}</p>
                <hr> 
            `;
            container.appendChild(entryDiv);//adding new html nodes under another html node
        });
    }

    // Journal Object Creator
    function createEntry(name, date, location, entry, imageFile) {
        return {
            name: name,
            date: date,
            location: location,
            entry: entry,
            imageFile: imageFile
        }
    }

    // Show all stored users
    console.log('All localStorage keys:', Object.keys(localStorage));


    // ===== INDEX.HTML FUNCTIONALITY ====

    const root = document.getElementsByClassName("root")[0];


    // Form functionality (only if form exists)
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', async function (event) { // pauses execution of function until awaited Promise is resolved or rejected
            event.preventDefault(); // prevent default form submission

            const form = new FormData(event.target);
            const name = form.get('user');
            const date = form.get('date');
            const location = form.get('location');
            const entry = form.get('entry');
            const imageFile = form.get('myImage');

            console.log("Name:", name);
            console.log("Date:", date);
            console.log("Location:", location);
            console.log("Entry:", entry);
            console.log("Image:", imageFile);

            // // Handle image file and create URL if exists
            // let imageUrl = null;
            // if (imageFile && imageFile.size > 0) {
            //     imageUrl = URL.createObjectURL(imageFile);
            //     console.log("Created image URL:", imageUrl);
            // }

            function base64(imageFile) {
                return new Promise((resolve, reject) => {
                    let reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = () => reject(new Error)
                    reader.readAsDataURL(imageFile)
                });
            }
            // Create and add entry to array with correct parameter order
            let imageDataUrl = null;
            if (imageFile && imageFile.size > 0) {
                try { // protected zone to run code so crashes dont affect entire program
                    imageDataUrl = await base64(imageFile); // waits for promise to resolve and pauses async function
                } catch (error) {
                    console.error(error); // error needs to go somewhere
                }
            }

            const newEntry = createEntry(name, date, location, entry, imageDataUrl);
            arrayOfEntries.push(newEntry);
            console.log('Entry added to array:', newEntry);
            console.log('Updated array:', arrayOfEntries);



            //Store in user's collection 
            const updatedEntries = addEntryToUser(name, {
                date: date,
                location: location,
                entry: entry,
                imageUrl: imageDataUrl,
                timestamp: new Date().toISOString() //turns date into string format
            });

            console.log('All entries for this user:', updatedEntries);

            // Handle image preview if file exists
            if (imageDataUrl) {
                const imagePreview = document.getElementById('imagePreview')
                if (imagePreview) {
                    imagePreview.src = imageDataUrl; // Use imageDataUrl instead of imageUrl
                    imagePreview.style.display = 'block';
                }
            }

            //success message
            const successMessageContainer = document.getElementById('successMessageContainer');
            if (successMessageContainer) {
                const successMessage = document.createElement('p')
                successMessage.textContent = 'Successful submission!'
                successMessage.style.color = 'green';
                successMessageContainer.appendChild(successMessage);

                // Clear success message after 3 seconds
                setTimeout(() => {
                    successMessageContainer.innerHTML = '';
                }, 3000);
            }

        });
    }


    // ===== DASHBOARD.HTML ====

    const nameEntry = document.getElementById("nameEntry");

    //only run this code if we're on a page that has the "nameEntry" element
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
                    //adding the listener for when user enters their name in dashboard

                    dashboardButton.addEventListener('change', function () {
                        // Get ALL entries for this user using the collection method
                        let allUserEntries = getAllUserEntries(inputValue);
                        console.log('All entries for user:', allUserEntries);

                        // Get the first element from the collection
                        let entriesContainer = document.getElementsByClassName('userEntries')[0];

                        if (entriesContainer) {
                            // Clear previous content
                            entriesContainer.innerHTML = '';

                            if (allUserEntries.length > 0) {
                                // spread operator to iterate through all entries in the array
                                [...allUserEntries].forEach((entry, index) => {
                                    // Create a display element for each entry
                                    const entryDiv = document.createElement('div');
                                    entryDiv.className = 'single-entry';
                                    entryDiv.style.border = '1px solid #00000000';
                                    entryDiv.style.padding = '20px';

                                    entryDiv.innerHTML = `
                                        <h4>Entry ${index + 1}</h4>
                                        <p><strong>Date:</strong> ${entry.date}</p>
                                        <p><strong>Location:</strong> ${entry.location}</p>
                                        <p><strong>Entry:</strong> ${entry.entry}</p>
                                        ${entry.imageUrl ? `<img src="${entry.imageUrl}" alt="Entry image" style="max-width: 200px; display: block; margin-top: 10px;">` : ''}
                                        <small><strong>Added:</strong> ${entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'Unknown'}</small>
                                    `;
                                    entriesContainer.appendChild(entryDiv);
                                });
                            } else {
                                const noEntriesDiv = document.createElement('div');
                                noEntriesDiv.textContent = `No entries found for user: ${inputValue}`;
                                entriesContainer.appendChild(noEntriesDiv);
                            }
                        }
                    })
                    entriesContainer.appendChild(summary);
                } else {
                    const noEntries = document.createElement("div");
                    noEntries.textContent = `No entries found for user: ${inputValue}`;
                    entriesContainer.appendChild(noEntries);
                }
            }
        });
        // Filter functionality (only add listener once)
        const filter = document.getElementById('filter');
        if (filter) {
            filter.addEventListener("change", function () {
                const selectedOption = this.value;
                const inputValue = nameEntry.value.trim();

                if (inputValue && selectedOption) {
                    let allUserEntries = getAllUserEntries(inputValue);
                    let entriesContainer = document.getElementsByClassName('userEntries')[0];

                    if (entriesContainer && allUserEntries.length > 0) {
                        // Sort entries based on selection
                        if (selectedOption === 'location') {
                            allUserEntries.sort((a, b) => a.location.localeCompare(b.location));
                        }
                        if (selectedOption === 'date') {
                            allUserEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
                        }

                        // Clear and redisplay sorted entries
                        entriesContainer.innerHTML = '';
                        allUserEntries.forEach((entry, index) => {
                            const entryDiv = document.createElement('div');
                            entryDiv.className = 'single-entry';
                            entryDiv.style.border = '1px solid #ccc';
                            entryDiv.style.padding = '20px';
                            entryDiv.style.margin = '10px 0';

                            entryDiv.innerHTML = `
                                <h4>Entry ${index + 1} (Sorted by ${selectedOption})</h4>
                                <p><strong>Date:</strong> ${entry.date}</p>
                                <p><strong>Location:</strong> ${entry.location}</p>
                                <p><strong>Entry:</strong> ${entry.entry}</p>
                                ${entry.imageUrl ? `<img src="${entry.imageUrl}" alt="Entry image" style="max-width: 200px; display: block; margin-top: 10px;">` : ''}
                                <small><strong>Added:</strong> ${entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'Unknown'}</small>
                            `;
                            entriesContainer.appendChild(entryDiv);
                        });
                    }
                }
            });
        }
    }

    // ===== CLEAR DATA ======
    const clearButton = document.getElementById('clearButton');
    if (clearButton) {
        clearButton.addEventListener('click', function () {
            localStorage.clear();
            console.log('LocalStorage cleared');
        });
    }

    // Initial logging
    console.log('Initial array of entries:', arrayOfEntries);

});




