import Image from 'next/image';
import { useState, useEffect } from "react";
import { getAvatarList } from "services/images";

export const AvatarSelector = ({ setSelectedAvatar }) => {
  const [avatarList, setAvatarList] = useState([]);
  const [selectedAvatar, setSelectedAvatarLocal] = useState('');

  useEffect(() => {
    const loadAvatarList = async () => {
      const response = await getAvatarList();
      const json = await response.json();

      setAvatarList(json?.avatars || []);
    };

    loadAvatarList();
  }, []);

  const handleOnClick = (avatar) => {
    let avatarName = avatar.name;
    
    if (avatarName === selectedAvatar) {
      avatarName = '';
    }

    setSelectedAvatarLocal(avatarName);
    setSelectedAvatar(avatarName);
  };

  return (
    <>
      <div className="flex justify-center gap-3 mt-4">
        <div className="grid grid-cols-6 gap-3 mt-4">
        {avatarList.map((avatar, index) => (
            <div key={index} className="m-2 relative">
              <Image
                src={avatar.src}
                name={avatar.name}
                alt={''}
                width={40}
                height={40}
                objectFit="contain"
                className={`icon cursor-pointer hover:scale-150 transition-transform duration-200 ${
                  selectedAvatar === avatar.name ? 'scale-150 border-2 border-custom-green' : ''
                }`}
                onClick={(e) => handleOnClick(avatar)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
};
