import { AvatarSelector } from './AvatarSelector';
import { EnterYourName } from './EnterYourName';
import { LoginSignup } from './LoginSignup';
import { useState } from "react";

const useAvatarSelection = () => {
  const [selectedAvatar, setSelectedAvatar] = useState('');

  const handleAvatarSelection = (avatarSrc) => {
    setSelectedAvatar(avatarSrc);
  };

  return { selectedAvatar, handleAvatarSelection };
};

export const AuthType = ({ authType }) => {
  const { selectedAvatar, handleAvatarSelection } = useAvatarSelection(); // Use the custom hook

  return (
    <>
      {
        authType === 'auth0' && 
        <LoginSignup />
      }
      {
        authType === 'cookie' && (
          <>
            <EnterYourName selectedAvatar={selectedAvatar} />
            <AvatarSelector setSelectedAvatar={handleAvatarSelection} />
          </>
      )
      }
    </>
  )
};

