import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import io, { Socket } from 'socket.io-client';
import axios from 'axios';
import MailerForm from './components/MailerForm.component';
import { Col, Container, Row } from 'react-bootstrap';
import ProgressBarComponent from './components/ProgressBar.component';
import RightColumnComponent from './components/RightColumn.component';

const ServerUrl = 'http://localhost:4000';
const SocketUrl = 'http://localhost:4000';

function App() {
  const [jobId, setJobId] = useState<string>('');
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sentCount, setSentCount] = useState<number>(0);
  const socketRef = useRef<Socket | null>(null);
  const ACTIVE_JOB_ID_LOCAL_STORAGE_KEY = 'activeJobId';
  const TOTAL_COUNT_LOCAL_STORAGE_KEY = 'totalCount';
  const EMAIL_SENT_EVENT = 'email_sent_event';
  const CONNECTION_CLOSE_EVENT = 'close_connection';

  useEffect(() => {
    const savedClientId = localStorage.getItem(ACTIVE_JOB_ID_LOCAL_STORAGE_KEY);

    if (savedClientId) {
      const mailTotalCount = localStorage.getItem(TOTAL_COUNT_LOCAL_STORAGE_KEY);
      setTotalCount(parseInt(mailTotalCount ?? '', 10));
      setJobId(savedClientId);
      initSocketConnection(savedClientId);
    }

    const handleWindowClose = () => {
      closeSocketConnection();
    };

    window.addEventListener('beforeunload', handleWindowClose);
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
    };
  }, []);

  const initSocketConnection = (jobId: string) => {
    socketRef.current = io(SocketUrl, {
      transports: ['websocket'],
      query: { jobId }
    });

    socketRef.current.on(EMAIL_SENT_EVENT, ({ count }: { count: number }) => {
      setSentCount(+count);
    });
  };

  const closeSocketConnection = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  }

  const processSendMail = async (count: number) => {
    try {
      setShowLoader(true);
      setTotalCount(count);

      const response = await axios.post(`${ServerUrl}/api/mailer`, { count });
      const { jobId } = response.data.payload;
      localStorage.setItem(ACTIVE_JOB_ID_LOCAL_STORAGE_KEY, jobId);
      localStorage.setItem(TOTAL_COUNT_LOCAL_STORAGE_KEY, count.toString());
      setJobId(jobId);
      initSocketConnection(jobId);
    } catch (error) {
    } finally {
      setShowLoader(false);
    }
  };

  const reset = async () => {
    await socketRef.current?.emit(CONNECTION_CLOSE_EVENT, { jobId });
    localStorage.setItem(ACTIVE_JOB_ID_LOCAL_STORAGE_KEY, '');
    localStorage.setItem(TOTAL_COUNT_LOCAL_STORAGE_KEY, '');
    setJobId('');
    setTotalCount(0);
    closeSocketConnection();
  };

  return (
    <>
      <div className="login-page bg-light">
        <Container>
          <Row>
            <Col lg={10} className="offset-lg-1">
              <div className="bg-white shadow rounded">
                <Row>
                  {jobId ? (
                    <ProgressBarComponent totalCount={totalCount} sentCount={sentCount} reset={reset} />
                  ) : (
                    <MailerForm processSendMail={processSendMail} showLoader={showLoader} />
                  )}
                  <RightColumnComponent />
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