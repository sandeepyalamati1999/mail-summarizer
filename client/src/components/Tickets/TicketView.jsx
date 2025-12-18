import DOMPurify from 'dompurify';
import { useParams } from 'react-router-dom';
import { useGetAllDetailsQuery } from '../../redux/Apislice';

const TicketView = () => {
  const params = useParams();
  const { data } = useGetAllDetailsQuery(`tickets/${params.ticketId}`);
  console.log(data);
  return (
    <div>
      {data && (
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(data?.details?.emailId?.body),
          }}
        ></div>
      )}
    </div>
  );
};

export default TicketView;
