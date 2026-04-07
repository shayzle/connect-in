import { useState } from 'react';     
import { Navigate } from "react-router-dom";


function Delete () {
    return (
        <button href="/login" className="py-2 px-3 border rounded-md bg-red-700 text-white text-lg font-semibold m-2 w-38 h-12">
            Delete
        </button>
    );
};

export default Delete;