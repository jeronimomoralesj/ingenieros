import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LinkGenerator = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleRoomChange = (e) => {
    setRoomId(e.target.value);
  };

  const generateLink = () => {
    if (roomId.trim()) {
      navigate(`/call/${roomId}`);
    }
  };

  return (
    <div className="link-generator">
      <h1>Generate a Video Call Link</h1>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={handleRoomChange}
      />
      <button onClick={generateLink}>Generate Link</button>

      {roomId && (
        <div>
          <p>Your room link: <strong>{`${window.location.origin}/call/${roomId}`}</strong></p>
          <button onClick={() => navigate(`/call/${roomId}`)}>Join Call</button>
        </div>
      )}
    </div>
  );
};

export default LinkGenerator;
