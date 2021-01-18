//@ts-nocheck
import React, { createContext, useState, useContext } from "react";

const AppContext = createContext({})

const AppProvider = ({ children }) => {
    const [dataUpdated, setDataUpdated] = useState(false)

    const update = () => setDataUpdated(!dataUpdated)

    return (
        <AppContext.Provider value={{ dataUpdated: dataUpdated, update: update }}>
            {children}
        </AppContext.Provider>
    )
}

function appContext() {
    const context = useContext(AppContext)
    return context
}

export { AppProvider, appContext }