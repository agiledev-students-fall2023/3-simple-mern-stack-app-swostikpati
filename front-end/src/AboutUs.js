import React, { useState } from 'react';

const AboutUs = () => {
    // using useState to keep track of when the data has been loaded
    const [data, setData] = useState(null);

    // until the data has been loaded, show a loading message
    if (!data) {
        // making request to the server using fetch 
        // using the path of the backend server directory from the env file is extremely imp
        fetch(`${process.env.REACT_APP_SERVER_HOSTNAME}/about`)
            .then(res => res.json()) // parse the response as JSON object
            .then(data => setData(data)) // change the state of the data
            .catch(err => console.error(err)); // incase there was an error loading the data 
        return <div>Loading...</div>;
    }

    //once the data has been loaded, it is formatted and displayed
    return (
        <div>
            <img src={data.imageUrl} alt="My Image" />
            <h1>{data.name}</h1>
            <p>{data.description}</p>
        </div>
    );
}

export default AboutUs;
