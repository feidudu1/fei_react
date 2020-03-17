import React from 'react';
import PropTypes from 'prop-types';

export const ReactPropsDemo = ({name, address, age}) => {
    return (
        <div>
            <div>
                {/* 如果父组件是jsx的形式，那么这里也要用jsx的形式 */}
                <span className="label">Name:</span>
                <span>{name}</span>
            </div>
            <div>
                <span className="label">Address:</span>
                <span>{address.city}</span>
            </div>
            <div>
                <span className="label">Age:</span>
                <span>{age}</span>
            </div>
        </div>
    )
}


ReactPropsDemo.defaultProps = {
    name: 'myname',
    age: 100,
    address: {city: "0000 onestreet"}
};

ReactPropsDemo.propTypes = {
    name: PropTypes.string.isRequired,
    address: PropTypes.objectOf(PropTypes.string),
    age: PropTypes.number.isRequired
}
