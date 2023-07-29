import React from 'react'
import { Col } from 'react-bootstrap'

function RightColumnComponent() {
    return (
        <Col md={6} className="ps-0 d-none d-md-block">
            <div className="form-right h-100 bg-primary text-white text-center py-5">
                <div className="pt-4">
                    <i className="bi bi-send-fill"></i>
                </div>
                <h6 className="fs-4 mt-3">Mailer App</h6>
            </div>
        </Col>
    )
}

export default RightColumnComponent