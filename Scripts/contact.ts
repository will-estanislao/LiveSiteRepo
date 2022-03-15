namespace core
{
   export class Contact     // Export indicates class is available w/in core namespace
   {
        // Private instance members
       private m_fullName: string;
       private m_contactNumber: string;
       private m_emailAddress: string;
       // Export this class is gonna be available in the core namespace
       // Public properties first (Getters + setters)
       public get FullName() : string
       {
           return this.m_fullName;
       }

       public set FullName(fullName : string) 
       {
           this.m_fullName = fullName;
       }

       public get ContactNumber() : string
       {
           return this.m_contactNumber;
       }

       public set ContactNumber(contactNumber : string) 
       {
           this.m_contactNumber = contactNumber;
       }

       public get EmailAddress() : string
       {
           return this.m_emailAddress;
       }

       public set EmailAddress(emailAddress : string) 
       {
           this.m_emailAddress = emailAddress;
       }

       // Way of storing/retrieving data in loval storage
       // constructor - w/ default parameters (optional)
       // Purpose can create empty object, serialize info and then fill it
       constructor(fullName: string = "", contactNumber:string = "", emailAddress:string = "") 
       {
           this.m_fullName = fullName;
           this.m_contactNumber = contactNumber;
           this.m_emailAddress = emailAddress;
       }

       
       /**
        * Takes contact and puts it into a comma separated list
        * 
        * @returns {(string | null)}
        */
       serialize(): string | null
       {
           // Returns a value or returns no. Puts it into local storage
           if (this.FullName !== "" && this.ContactNumber !== "" && this.EmailAddress !== "") 
           {
               return `${this.FullName},${this.ContactNumber},${this.EmailAddress}`;
           }
            else 
           {
               console.error("One or more properties of the Contact are missing or empty");
               return null;
           }
       }

       // data is array - create an array of string
       // Don't know what data coming in is, but the data array will accept it as string
       // data is assumed to be a comma-separated list of properties
       /**
        * 
        * 
        * @param {string} data
        * @returns {void} 
        */
       deserialize(data : string): void
        {
           let propertyArray : string[] = data.split(",");
           this.FullName = propertyArray[0];
           this.ContactNumber = propertyArray[1];
           this.EmailAddress = propertyArray[2];
       }

       // public overrides
       // Shows up in console
       /**
        * 
        * @returns {string}
        * @override
        */
       toString() 
       {
           return `Full Name: ${this.FullName} Contact Number: ${this.ContactNumber} Email Address: ${this.EmailAddress}`;
       }
   }
}


