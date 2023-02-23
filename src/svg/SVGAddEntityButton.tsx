import React, { CSSProperties } from 'react';

const PlusHexagon = () => {
    const addFieldButtonStyle: CSSProperties = {
        padding: 0,
    };

    const addRectangleStyle: CSSProperties = {
        margin: 'auto',
        height: '4px',
        position: 'static',
        width: '100%',
        backgroundColor: '#009AA9',
    };

    const plusHexStyle: CSSProperties = {
        overflow: 'visible',
        marginLeft: '50%',
    };

    return (
        <div style={addFieldButtonStyle}>
            <div style={addRectangleStyle}></div>
            <div className={'add-button-wrapper'}>
                <svg
                    style={plusHexStyle}
                    width="26"
                    height="22"
                    viewBox="16 0 26 22"
                    fill="none"
                >
                    <path
                        d="M1.05067 12.6273C0.411088 11.6367 0.411088 10.3633 1.05067 9.37273L6.21597 1.37273C6.76853 0.516931 7.7176 1.57e-06 8.73628 1.52547e-06L17.2637 1.15273e-06C18.2824 1.1082e-06 19.2315 0.516931 19.784 1.37273L24.9493 9.37272C25.5889 10.3633 25.5889 11.6367 24.9493 12.6273L19.784 20.6273C19.2315 21.4831 18.2824 22 17.2637 22L8.73629 22C7.71761 22 6.76853 21.4831 6.21597 20.6273L1.05067 12.6273Z"
                        fill="#009AA9"
                    />
                    <svg
                        width="24"
                        height="24"
                        viewBox="-7 -5 26 26"
                        fill="none"
                    >
                        <path
                            d="M12.3145 6.65686L1.00144 6.65756"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                        <path
                            d="M6.65723 1L6.65653 12.313"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </svg>
            </div>
        </div>
    );
};

export default PlusHexagon;
