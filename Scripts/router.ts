namespace core
{
    
    // Want active link to keep track of
    // Routing table - array of strings to route around
    export class Router
    {

        // Private fields/instance members
        private m_activeLink: string;
        private m_routingTable: string[];
        private m_linkData: string;

        // Public Properties (getters/setters)
    
        /**
         * @returns {string}
         */
        public get ActiveLink(): string
        {
            return this.m_activeLink;
        }

        /**
         * @param {string} link
         * @returns {void}
         */
        public set ActiveLink(link)
        {
            this.m_activeLink = link;
        }

        /**
         * @returns {string}
         */
         public get LinkData():  string
         {
             return this.m_linkData;
         }
 
         /**
          * @param {string} data
          * @returns {void}
          */
         public set LinkData(data: string)
         {
             this.m_linkData = data;
         }
        // Constructor function
        constructor()
        {
            this.m_activeLink = "";
            this.m_linkData = "";
            // this.m_routingTable = new Array<string>(); // Creates an empty string array collection - C# way
            this.m_routingTable = [];                     // Alternate way
        }

        // Public methods

        /**
         * This method adds a new route to the Routing Table
         * 
         * @param {string} route 
         * @returns {void}
         */
        Add(route: string): void
        {
            this.m_routingTable.push(route);
        }

        /**
         * This method replaces the reference for the Routing Table with a new one
         * Note: Routes should beging with a '/' character
         * 
         * @param {string[]} routingTable 
         * @returns {void}
         */
        AddTable(routingTable: string[]): void
        {
            this.m_routingTable = routingTable;
        }

        /**
         * This method finds  and returns the index of the route in the Routing Table
         * otherwise, returns -1 if route not found
         * 
         * @param {string} route 
         * @returns {number}
         */
        Find(route: string): number
        {
            return this.m_routingTable.indexOf(route);
        }

        /**
         * This method removes a Route from the Routing Table.
         * It returns true if the route was successfully removed
         * Otherwise, it returns false
         * 
         * @param {*} route 
         * @returns {boolean}
         */
        Remove(route: string) : boolean
        {
            // If route is found,
            if(this.Find(route) > -1)
            {
                // Remove the route
                this.m_routingTable.splice(this.Find(route), 1);
                return true;
            }
            return false;
        }

        // Public override methods
        /**
         * This method overrides the built-in toString method and
         * returns the routing table in a comma-separated string
         * 
         * @override
         * @returns {string}
         */
        toString() : string
        {
            return this.m_routingTable.toString();
        }
    }
}

let router: core.Router = new core.Router();
router.AddTable([
    "/", // Default route
    "/home",
    "/about",
    "/services",
    "/contact",
    "/contact-list",
    "/products",
    "/register",
    "/login",
    "/edit"
]);

let route: string = location.pathname; // Alias for location.pathname

// If route is found in Routing Table
router.ActiveLink = (router.Find(route) > -1) ? (route == "/") ? "home" : route.substring(1) : "404";

// If route is found in the routing table. Same as ^^
// if (router.Find(route) > -1)
// {
//     router.ActiveLink = (route == "/") ? "home" : route.substring(1);
// }
// else
// {
//     router.ActiveLink = "404";
// }

