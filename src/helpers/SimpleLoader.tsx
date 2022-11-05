import React, {useEffect, useState} from "react";

interface Props {
    loader: () => Promise<any>,
    children: any
}

export const SimpleLoader = (props: Props) => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        props.loader()
            .then(() => {
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    return (
        <>
            {loading &&
                <div>LOADING!</div>
            }

            {!loading &&
                props.children
            }
        </>
    );
};