import React from 'react';

function Card({ name, id, value }) {
    return (
        <div className='mainCard' id={id}>
            <p>{name}</p>
            <span>{value}</span>
        </div>
    );
}

export default Card;
