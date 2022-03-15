"use strict";
((function()
{
    // List of protected routes
    let protected_routes: string[] = [
        "contact-list"
    ];

    // console.log(protected_routes.indexOf(router.ActiveLink) === -1);
    
    if(protected_routes.indexOf(router.ActiveLink) > -1)
    {
        // Check if user is logged in
        if(!sessionStorage.getItem("user"))
        {
            // If not...redirect them back to login page
            location.href = "/login";
        }
    }

}))();