import { useState } from 'react';     
import { Navigate } from "react-router-dom";


function DeleteAll () {
    return (
        <button href="/login" className="py-2 px-3 border rounded-md bg-red-900 text-white text-lg font-semibold m-2 w-38 h-12">
            Delete All
        </button>
    );
};

export default DeleteAll;