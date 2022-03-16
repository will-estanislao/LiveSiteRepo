/** 
 * app.js
 * Author: Will Estanislao
 * Date: 11/02/22
 * Desc: 
 */

//IIFE -- Immediately Invoked Function Expression
// AKA -- Anonymous Self-Executing Function
(function()
{
    /**
     * This function uses AJAX to open a connection to the server and returns
     * the data payload to the callback function
     * @param {stirng} method 
     * @param {string} url 
     * @param {Function} callback 
     * @returns {void}  
     */
    // function AjaxRequest(method: string, url: string, callback: Function): void
    // {
    //     //AJAX Steps - Making a request!
    //     // Step 1 - Instantiate an XHR Object
    //     let XHR = new XMLHttpRequest();

    //     //Step2. Add an event listener/ready state
    //     XHR.addEventListener("readystatechange", ()=>
    //     {
    //         if(XHR.readyState === 4 && XHR.status === 200)
    //         {
    //             if(typeof callback === "function")
    //             {
    //                 callback(XHR.responseText); // Prints to console
    //             }
    //             else
    //             {
    //                  console.error("ERROR: callback not a function");
    //             }
                
    //         }
    //     });

    //     // Step 3 - Open connection to server
    //     XHR.open(method, url);

    //     // Step 4 - Send request to server
    //     XHR.send();
    // }

    function AuthGuard(): void
    {
        // List of protected routes
        let protected_routes: string[] = [
            "contact-list"
        ];
    
        if(protected_routes.indexOf(router.ActiveLink) > -1)
        {
            // Check if user is logged in
            if(!sessionStorage.getItem("user"))
            {
                // If not...redirect them back to login page
                router.ActiveLink = "login";
            }
        }
    }

    function LoadLink(link: string, data: string = ""): void
    {
        router.ActiveLink = link; // this replaces any instance of href to load link

        AuthGuard();              // Call authguard to check if user is logged in 

        router.LinkData = data;
        history.pushState({}, "", router.ActiveLink); 

        // Capitalizes the router active link and set the title to it
        document.title = router.ActiveLink.substring(0,1).toUpperCase() + router.ActiveLink.substring(1);

        // Remove all active links - must do this bc page is never refreshed, need to manually change things
        $("ul>li>a").each(function()
        {
            $(this).removeClass("active");
        });

        $(`li>a:contains(${document.title})`).addClass("active"); // Update active link

        LoadContent();
    }

    function AddNavigationEvents(): void
    {
        let navLinks = $("ul>li>a"); // Find all navigation links

        // Remove navigation events
        navLinks.off("click");
        navLinks.off("mouseover");

        // Want to loop thru each nav link and load appropriate content on click
        navLinks.on("click", function()
        {
            LoadLink($(this).attr("data") as string);
        });

        // Make the nav links look like they are clickable
        navLinks.on("mouseover", function()
        {
            $(this).css("cursor", "pointer");
        });
    }

    /**
     * 
     * 
     * @param {string} link 
     */
    function AddLinkEvents(link: string): void
    {
        let linkQuery = $(`a.link[data=${link}]`);

        // remove all link events
        linkQuery.off("click");
        linkQuery.off("mouseover"); // Hover over obj
        linkQuery.off("mouseout");  // Hover away from 
        
        // add css to adjust the link aesthetics
        linkQuery.css("text-decoration", "underline");
        linkQuery.css("color", "blue");

        // add link events
        linkQuery.on("click", function()
        {
            LoadLink(`${link}`);
        });

        linkQuery.on("mouseover", function()
        {
            $(this).css("cursor", "pointer");
            $(this).css("font-weight", "bold");
        });

        linkQuery.on("mouseout", function()
        {
            $(this).css("font-weight", "normal");
        });
    }

    /**
     * This function loads the header.html content into the page
     * The contents of html header will be injected
     * 
     * @returns {void}
     */
    function LoadHeader(): void
    {
        //  Use AJAX to load the header content
        $.get("./Views/components/header.html", function(html_data)
        {
            // inject Header content into the page
            $("header").html(html_data);

            AddNavigationEvents();
        
            CheckLogin();
        });
    } 

    /**
     * 
     * @param {string} activeLink 
     * @param {Function} callback 
     * @returns {void}
     */
    function LoadContent(): void
    {
        let page_name = router.ActiveLink; // alias for active link
        let callback: Function = ActiveLinkCallBack(); // Returns a reference to the correct function
        $.get(`./Views/content/${page_name}.html`, function(html_date)
        {
            $("main").html(html_date);

            CheckLogin();

            callback(); // Calling correct function
        });
    }

    /**
     * Loads the footer navbar of the page, injects the html in footer.html
     * 
     * @returns {void}
     */
    function LoadFooter(): void
    {
        $.get(`./Views/components/footer.html`, function(html_date)
        {
            $("footer").html(html_date);
        });
    }

    // To avoid breaking JS since button may not exist on other pages
    function DisplayHomePage(): void
    {
        console.log("Homepage loaded")

        // Jquery to select
        $("#AboutUsButton").on("click",() =>
        {
            LoadLink("about");
        })

        // Using JQuery to insert elements
        $("main").append(`<p id="MainParagraph" class = "mt-3"> This is a Main Paragraph! </p>`);
        $("main").append(`<article><p id="ArticleParagraph" class="mt-3"> This is the Article Paragraph"</p></article>`);

    }

    function DisplayProductsPage(): void
    {
        console.log("Products Page Loaded");
    }

    function DisplayServicesPage(): void
    {
        console.log("Services Page Loaded");
    }

    function DisplayAboutPage(): void
    {
        console.log("About Page Loaded");
    }

    /**
     * This function adds a Contact object to localStorage
     * @param {string} fullName 
     * @param {string} contactNumber 
     * @param {string} emailAddress 
     */
    function AddContact(fullName: string, contactNumber: string, emailAddress: string)
    {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        // console.log(contact.serialize());
        if(contact.serialize())
        {
            // Unique key for each contact, using first chara of their name and current date
            let key = contact.FullName.substring(0, 1) + Date.now();
            // Store in local storage
            localStorage.setItem(key, contact.serialize() as string); // Cast contact.serialize() as string and will not return null
        }
    }

    /**
     * This method validates a field in the form and displays an error in the message area div element
     * @param {string} fieldID 
     * @param {regex} regular_expression 
     * @param {string} error_message 
     */
    function ValidateField(fieldID: string, regular_expression: RegExp, error_message: string)
    {
        let messageArea = $("#MessageArea").hide();

        $("#" + fieldID).on("blur", function()
        {
            let text_value: string = $(this).val() as string;
            if(!regular_expression.test(text_value))
            {
                // You can chain methods
                $(this).trigger("select").trigger("focus"); 
                messageArea.addClass("alert alert-danger").text(error_message).show(); 
            }
            else
            {
                messageArea.removeAttr("class").hide();
            }
        });

    }

    /**
     * Regex checks for validating input onto a user form
     */
    function ContactFormValidation(): void
    {
        ValidateField("fullName", /^([A-Z][a-z]{1,3}.?\s)?([A-Z][a-z]{1,})((\s|,|-)([A-Z][a-z]{1,}))*(\s|,|-)([A-Z][a-z]{1,})$/, "Please enter a valid Full Name. This must inclue at least a Capitalized First Name and a Capitalized Last Name");
        ValidateField("contactNumber", /^(\+\d{1,3}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, "Please enter a valid phone number! Example: 905 123 4567");
        ValidateField("emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/, " Please enter a valid email address!");

    }

    function DisplayContactPage(): void
    {
        console.log("Contact Page Loaded");

        $("a[data='contact-list']").off("click");
        $("a[data='contact-list']").on("click", function()
        {
            LoadLink("contact-list");
        });

        ContactFormValidation();

        // When send button is clicked
        // When subscribe check box is checked
        let sendButton = document.getElementById("sendButton") as HTMLElement; // Can cast
        let subscribeCheckbox = document.getElementById("subscribeCheckbox") as HTMLInputElement; // Special type

        // When user adds new contact
        sendButton.addEventListener("click", function()
        {
            // Just check if box is checked, instead of event listening
            // Only if subscribe checkbox is checked
            if(subscribeCheckbox.checked)
            {
                let fullName = document.forms[0].fullName.value; // Need to tell typescript there is a form
                let contactNumber = document.forms[0].contactNumber.value; 
                let emailAddress = document.forms[0].emailAddress.value; 

                console.log("Subscriber Checked");
                // console.log(contact.serialize());

                AddContact(fullName, contactNumber,emailAddress);

                // let contact = new core.Contact(fullName, contactNumber, emailAddress);
                // if(contact.serialize())
                // {
                //     // Unique key for each contact, using first chara of their name and current date
                //     let key = contact.FullName.substring(0, 1) + Date.now();

                //     // Store in local storage
                //     localStorage.setItem(key, contact.serialize() as string);
                // }
            }
        });
    }

    // Show the contacts list on the ContactList page
    function DisplayContactListPage(): void
    {
        if(localStorage.length > 0)
        {
            let contactList = document.getElementById("contactList") as HTMLElement;

            let data = "";

            // Get the keys from local storage - gives list of keys (which hold user info) [o:]
            let keys = Object.keys(localStorage);

            let index = 1;
            
            // for every key in the keys string array - essentially one row on contact table
            for(const key of keys)
            {
                let contactData = localStorage.getItem(key) as string; // get localStorage data value

                // Instantiate contact obj - empty contact
                let contact = new core.Contact();
                
                // contactData retrieved from local storage
                contact.deserialize(contactData as string);

                console.log(contact.toString);

                // Formatting how data will look on page, notice table structure
                data += `<tr>
                <th scope="row" class="text-center"> ${index}</th>
                <td>${contact.FullName}</td>
                <td>${contact.ContactNumber}</td>
                <td>${contact.EmailAddress}</td>
                <td class="text-center"><button value="${key}" class="btn btn-primary btn-sm edit"><i class="fas fa-edit fa-sm"></i> Edit</button></td>
                <td class="text-center"><button value="${key}" class="btn btn-danger btn-sm delete"><i class="fas fa-trash-alt fa-sm"></i> Delete</button></td>
                </tr>`;

                index++;
            }

            contactList.innerHTML = data;

            // Not this as in scope
            // this as in what jquery returns
            // watch out for fat arrow functions - can change context (in jquery)
            // value is up there (contact) - trying to read value
            $("button.delete").on("click", function()
            {
                if(confirm("Are you sure you want to delete contact?"))
                {
                    localStorage.removeItem($(this).val() as string);
                    
                }
                LoadLink("contact-list"); // Refresh after deleting
                
            });

            $("button.edit").on("click", function()
            {
                LoadLink("edit", $(this).val() as string); 
            });
        }

        $("#addButton").on("click", ()=>
        {
            LoadLink("edit", "add");
        });
    }

    function DisplayEditPage(): void
    {
        console.log("Edit Page Loaded");

        ContactFormValidation();
        
        // Page info
        let page = router.LinkData; // Technically could just put the last part

        // Create instant scope - curly braces!
        switch(page)
        {
            case "add":
                {
                    $("main>h1").text("Add Contact");

                    $("#editButton").html(`<i class="fas fa-plus-circle fa-lg"></i> Add`);

                    // Need to prevent default behaviour
                    $("#editButton").on("click", (event) =>
                    {
                        event.preventDefault();

                        let fullName = document.forms[0].fullName.value; // Need to tell typescript there is a form
                        let contactNumber = document.forms[0].contactNumber.value; 
                        let emailAddress = document.forms[0].emailAddress.value; 

                        AddContact(fullName, contactNumber, emailAddress);
                        LoadLink("contact-list");
                    });

                    $("#cancelButton").on("click", () =>
                    {
                        LoadLink("contact-list");
                    });
                }
                break;
            default:
                {
                    // gets contact info from local storage
                    let contact = new core.Contact();
                    contact.deserialize(localStorage.getItem(page) as string);

                    // display the contact in the edit form - injects into forma nd shows it
                    $("#fullName").val(contact.FullName);
                    $("#contactNumber").val(contact.ContactNumber);
                    $("#emailAddress").val(contact.EmailAddress);

                    // Once edit button pressed
                    $("#editButton").on("click", (event) =>
                    {
                        event.preventDefault();

                        // Get the changes made on the page and store it 
                        contact.FullName = $("#fullName").val() as string;
                        contact.ContactNumber = $("#contactNumber").val() as string;
                        contact.EmailAddress = $("#emailAddress").val() as string;


                        // Replace item in local storage
                        localStorage.setItem(page, contact.serialize() as string);
                        // Refresh page - go back to contact-list
                        LoadLink("contact-list");
                    });

                    $("#cancelButton").on("click", () =>
                    {
                        LoadLink("contact-list");
                    });
                }
                break;
        }
    }

    function CheckLogin(): void
    {
        if(sessionStorage.getItem("user"))
        {
            //swap out the login link for logout
            $("#login").html(
                `<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>`
            );

            $("#logout").on("click", function()
            {
                // Perform logout
                sessionStorage.clear();

                // Swap out logout link to login
                $("#login").html(
                    `<a class="nav-link" data="login""><i class="fas fa-sign-in-alt"></i> Login</a>`
                );

                AddNavigationEvents();

                // Redirect back to login
                LoadLink("login");
            });
        }
    }

    // Remember asynchronous - this may cause data to cause no errors but not appear
    function DisplayLoginPage() : void
    {
        console.log("Login Page");

        // Find element with id messageArea
        let messageArea = $("#messageArea");
        messageArea.hide();

        // Check if data is passing through
        // console.log(data);

        AddLinkEvents("register"); // Manually adding links

        // Uses jQuery shortcut to load the users.json file
        $("#loginButton").on("click", function()
        {
            let success = false;
            let newUser = new core.User();

            // console.log(username); // for username check
            $.get("./Data/users.json", function(data)
            {
                //for every user in users.json file
                for (const user of data.users)
                {
                    let username = document.forms[0].username.value;
                    let password = document.forms[0].password.value; 

                    // Cjecl if username and password entered in the form matches this user
                    if(username == user.Username && password == user.Password)
                    {
                        // get user data from the file and assign to our empty user obj
                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }
                // If username and password matches - success, perform login sequence
                if(success)
                {
                    // add user to session storage
                    sessionStorage.setItem("user", newUser.serialize() as string);

                    // hide any error messages
                    messageArea.removeAttr("class").hide();

                    // $("#contactButton").show();

                    //redirect user to some secure area of site
                    LoadLink("contact-list");

                }
                // if user credentials are invalid...
                else
                {
                    // display an error message
                    $("#username").trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger").text("Error: Invalid Login Information").show();
                }
            });
        });

        $("#cancelButton").on("click", function()
            {
                // Clear the login form
                document.forms[0].reset();

                // Return to home page
                LoadLink("home");
            });
    }

    function DisplayRegisterPage(): void
    {
        console.log("Register Page");
        AddLinkEvents("login"); // Bottom of register page - theres a login
    }

    function Display404Page(): void
    {

    }

    /**
     * This method returns the appropriate function callback relative to the Active Link
     * 
     * @returns {Function}
     */
    function ActiveLinkCallBack(): Function
    {
        switch(router.ActiveLink)
        {
            case "home": return DisplayHomePage;
            case "about" : return DisplayAboutPage;
            case "products" : return DisplayProductsPage;
            case "services" : return DisplayServicesPage;
            case "contact" : return DisplayContactPage;
            case "contact-list" : return DisplayContactListPage;
            case "edit" : return DisplayEditPage;
            case "login" : return DisplayLoginPage;
            case "register" : return DisplayRegisterPage;
            case "404" : return Display404Page;
            default:
                console.error("ERROR: callback does not exist: " + router.ActiveLink);
                return new Function();
        }
    }


    // Named function
    // Will not execute until called
    /**
     * This is the entry point of the web application 
     * 
     */
    function Start(): void
    {
        console.log("App Started!");

        LoadHeader();
        // AjaxRequest("GET", "./Views/components/header.html", LoadHeader);

        LoadLink("home");
        // LoadContent();

        LoadFooter();  
    }

    // Similar to named function above, 2nd way to use function
    // Start identifier, points to memory space of the anon function
    // let Start = function()
    // {
    //     console.log("App Started!");
    // }

    // When the window loads, trigger Start method
    window.addEventListener("load", Start);
})();