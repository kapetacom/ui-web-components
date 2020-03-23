

import React, { CSSProperties } from "react";

const PlusHexagon = ()=>{

    const addFieldButtonStyle:CSSProperties = {
        width:"100%",
        padding:0,
        height:"20px"
    }

    const addRectangleStyle:CSSProperties = {
        margin:"auto",
        height:"4px",
        position:"sticky",
        top:"16px",
        width:"100%",
        backgroundColor:"#009AA9"
    }

    const plusHexStyle:CSSProperties = {
        position:"sticky",
        marginTop:"-12px",
        overflow:"visible",
    }
    
    return (
        <div style={addFieldButtonStyle}>
            <div style={addRectangleStyle} ></div>
            <div className={"add-button-wrapper"}>
                <svg style={plusHexStyle} height="40px" width="40px" viewBox="100 0 40 40" >
                    <path d="M321.051 12.6273C320.411 11.6367 320.411 10.3633 321.051 9.37273L326.216 1.37273C326.769 0.516931 327.718 1.57e-06 328.736 1.52547e-06L337.264 1.15273e-06C338.282 1.1082e-06 339.231 0.516931 339.784 1.37273L344.949 9.37272C345.589 10.3633 345.589 11.6367 344.949 12.6273L339.784 20.6273C339.231 21.4831 338.282 22 337.264 22L328.736 22C327.718 22 326.769 21.4831 326.216 20.6273L321.051 12.6273Z" fill="#009AA9"/>
                    <path d="M338.314 10.6569L327.001 10.6576" stroke="white" strokeWidth="1.5" fill="#fff" strokeLinecap="round"/>
                    <path d="M332.657 5L332.657 16.313" stroke="white" strokeWidth="1.5" fill="#fff" strokeLinecap="round"/>
                </svg>
            </div>
        </div>

    )
}

export default PlusHexagon;