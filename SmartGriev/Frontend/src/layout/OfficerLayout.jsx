import React from "react";
import OfficerSidebar from "../Components/OfficerComponents/OfficerSidebar";
import OfficerHeader from "../Components/OfficerComponents/OfficerHeader";

const OfficerLayout = ({ children }) => {
    return (
        <div style={{ display: "flex", background: "#f1f5f9" }}>
            <OfficerSidebar />

            <div style={{ flex: 1, marginLeft: "260px" }}>
                <OfficerHeader />

                <div style={{ padding: "30px" }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default OfficerLayout;