import { format } from 'date-fns';
import React from 'react';

const AppointmentComponents = ({date}) => {
    return (
        <div>
            <h4 className='text-xl text-secondary text-center'>Available Appointments on {format(date, 'PP')}</h4>
        </div>
    );
};

export default AppointmentComponents;