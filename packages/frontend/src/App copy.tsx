import { useEffect, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import io, { Socket } from 'socket.io-client';
import axios from 'axios';
import MailerForm from './components/mailerform';
import { Col, Container, Row } from 'react-bootstrap';
import ProgressBarComponent from './components/progressbar.component';

const ServerUrl = 'http://localhost:4000';

function App() {
  const [jobId, setJobId] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  let socket: Socket | null = null;

  useEffect(() => {
    const savedClientId = localStorage.getItem('clientId');
    console.log('saved Id', savedClientId);
    if (savedClientId) {
      const mailTotalCount = localStorage.getItem('totalCount');
      setTotalCount(parseInt(mailTotalCount ?? '') );
      setJobId(savedClientId);
      connectToSocket(savedClientId);
    }

    const handleWindowClose = () => {
      console.log('unload');
      if (socket) {
        console.log('disconnect socket');
        socket.disconnect();
      }
    };

    window.addEventListener('beforeunload', handleWindowClose);
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
    };
  }, []);

  const connectToSocket = (jobId: string) => {
    console.log(jobId);
    socket = io('http://localhost:4000', { transports: ['websocket'], query: { jobId } });
    console.log('connecting socket....');
    socket.on(`message`, (updatedData) => {
      console.log(updatedData);
      const { count } = updatedData;
      setSentCount(+count);
    });
  };

  const processSendMail = async (count: number) => {
    try {
      setShowLoader(true);
      setTotalCount(+count);
      // Send POST request to NestJS server
      const response = await axios.post(`${ServerUrl}/api/mailer`, { count: +count });
      const { jobId } = response.data.payload;
      localStorage.setItem('clientId', jobId);
      localStorage.setItem('totalCount', count.toString());
      setJobId(jobId);
      connectToSocket(jobId);
      setShowLoader(false);
    } catch (error) {
      setShowLoader(false);
      console.error('Error:', error);
    }
  };

  const reset = ()=>{
    localStorage.setItem('clientId', '');
    localStorage.setItem('totalCount', '');
    setJobId('');
    setTotalCount(0);
  }

  return (
    <>
      <div className="login-page bg-light">
        <Container>
          <Row>
            <Col lg={10} className="offset-lg-1">
              <div className="bg-white shadow rounded">
                <Row>
                  {jobId ? (
                    <ProgressBarComponent
                      totalCount={totalCount}
                      sentCount={sentCount}
                      reset = {reset}
                    />
                  ) : (
                    <MailerForm processSendMail={processSendMail} showLoader={showLoader} />
                  )}
                  <Col md={6} className="ps-0 d-none d-md-block">
                    <div className="form-right h-100 bg-primary text-white text-center py-5">
                      <div className="pt-4">
                        <i className="bi bi-send-dash-fill"></i>
                      </div>
                      <h6 className="fs-4 mt-3">Mailer App</h6>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default App;
