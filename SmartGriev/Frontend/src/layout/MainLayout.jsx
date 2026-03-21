import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MainLayout = ({ children }) => {

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

            <Header />
    
            <main style={{ flex: 1 }}>
                {children}
            </main>

            <Footer />

        </div>
    );
};

export default MainLayout;