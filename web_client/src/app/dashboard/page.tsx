"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Page() {
    const [userData, setUserData] = useState(null);
    // useEffect(() => {
    //     axios.get("/api/user").then((res) => {
    //         setUserData(res.data);
    //     });
    // }, []);

    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
}