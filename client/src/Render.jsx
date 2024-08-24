// import React, { useEffect, useState } from 'react';
// import Getuser from './Getuser';

// const Render = () => {
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     Getuser().then(result => {
//       setMessage(result); // Set the message state when the Promise resolves
//     }).catch(error => {
//       setMessage('Error: ' + error); // Set an error message if the Promise rejects
//     });
//   }, []);

//   return (
//     <div>
//       {message} {/* Render the message state */}
//     </div>
//   );
// }

// export default Render;


import React, { useEffect, useState } from 'react';
import SetUser from './SetUser';

const Render = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    SetUser().then(result => {
      setMessage(result); // Set the message state when the Promise resolves
    }).catch(error => {
      setMessage('Error: ' + error); // Set an error message if the Promise rejects
    });
  }, []);

  return (
    <div>
      {message} {/* Render the message state */}
    </div>
  );
}

export default Render;


