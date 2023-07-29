import React from 'react';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

const schema = yup.object().shape({
    number: yup.string().required('Number is required'),
});

type Props = {
    processSendMail: (count: number) => void;
    showLoader: boolean;
};

function MailerForm(props: Props) {
    const { showLoader, processSendMail } = props;

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'all',
    });

    const onSubmit = async (data: any) => {

        const { number } = data;
        await processSendMail(+number);
    };

    return (
        <Col md={6} className="pe-0">
            <div className="form-left h-100 py-5 px-5">
                <h3 className="mb-5">Send Mails</h3>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row className="g-4">
                        <Col xs={12}>
                            <Form.Label>
                                Mails Count<span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter count to send"
                                {...register('number')}
                                isInvalid={!!errors.number}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.number && errors.number.message}
                            </Form.Control.Feedback>
                        </Col>

                        <Col xs={12}>
                            <Button
                                type="submit"
                                variant='primary'
                                className="px-4 float-end mt-4"
                                disabled={!isValid || showLoader}
                            >
                                {showLoader ? (
                                    <span>
                                        <Spinner size="sm"></Spinner> Sending Mails
                                    </span>
                                ) : (
                                    <span>
                                        <i className="bi bi-send-fill"></i> Send Mail
                                    </span>
                                )}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Col>
    );
}

export default MailerForm;