import React, { useEffect, useState } from 'react';
import { Button, Col, ProgressBar } from 'react-bootstrap';

interface ProgressBarProps {
    totalCount: number;
    sentCount: number;
    reset: () => void;
}

const ProgressBarComponent: React.FC<ProgressBarProps> = ({ totalCount, sentCount, reset }) => {
    const [progressPercentage, setProgressPercentage] = useState(0);

    useEffect(() => {
        const percentage = (sentCount / totalCount) * 100;
        setProgressPercentage(percentage);
    }, [sentCount, totalCount]);

    return (
        <Col md={6} className="pe-0">
            <div className="form-left h-100 py-5 px-5">
                <h5 className="mb-5 text-secondary">Mail Sending Progress</h5>

                <ProgressBar animated now={progressPercentage} label={`${progressPercentage.toFixed(2)}%`} style={{ height: "30px" }} />

                <h5 className='mt-4 text-center'>Sending Mails: <span className='text-info'>{sentCount}</span> / <span className='text-primary'>{totalCount}</span></h5>
                <h5 className='mt-4 text-center text-info'>Progress: {progressPercentage.toFixed(2)}%</h5>

                {sentCount === totalCount &&
                    <div className='d-flex justify-content-center'>
                        <Button variant='primary' className='mt-4 text-white' onClick={reset}><i className="bi bi-skip-start"></i> Resend Emails</Button>
                    </div>}
            </div>
        </Col>
    );
};

export default React.memo(ProgressBarComponent);