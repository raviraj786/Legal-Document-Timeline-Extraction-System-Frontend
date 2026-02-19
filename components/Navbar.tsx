"use client";

import Link from "next/link";

export default function Navbar() {

 return (

   <div className="flex justify-between p-4 border-b">

     <div className="font-bold">

       Legal Timeline

     </div>

     <div className="space-x-4">

       <Link href="/dashboard">
         Dashboard
       </Link>

     </div>

   </div>

 );

}
