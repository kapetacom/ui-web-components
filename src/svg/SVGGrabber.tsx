import React from 'react';

const SVGGrabber = () => {
    return (
        <div className={'grabber'}>
            <svg
                width="10"
                height="20"
                viewBox="2 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                <circle cx="2" cy="14" r="2" fill="#C4C4C4" />
                <circle cx="8" cy="2" r="2" fill="#C4C4C4" />
                <circle cx="8" cy="8" r="2" fill="#C4C4C4" />
                <circle cx="8" cy="14" r="2" fill="#C4C4C4" />
            </svg>
        </div>
    );
};

export default SVGGrabber;
