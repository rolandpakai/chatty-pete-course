/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */
import { useUser } from "lib/auth/client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";
import Markdown from 'react-markdown'
import Cookies from 'universal-cookie';

const useUserCookie = (COOKIE_NAME) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isLoading = false;
    const cookies = new Cookies(null, { path: '/' });
    const user = cookies.get(COOKIE_NAME);

    const theme = user.picture.split('-')[0];
    user.picture = `/images/avatars/${theme}/${user.picture}`;

    setUser(user);
    setIsLoading(isLoading);
  }, []); 

  return {
    user,
    isLoading,
  }
}

const authModules = {
  'auth0': useUser,
  'cookie': useUserCookie,
};

const extractImagesFromMarkdown = (content) => {
  
  const jsonRegex = /```json(.*?)```/gs;
  const images = [];
  let match;
 
  while ((match = jsonRegex.exec(content)) !== null) {
      const jsonString = match[1].trim();

      try {
          let jsonData = JSON.parse(jsonString);

          if (!Array.isArray(jsonData) && jsonData.images) {
            jsonData = jsonData.images;
          }

          if (Array.isArray(jsonData)) {
              jsonData.forEach(image => {
                  if (image.src && image.alt) {
                      images.push(image);
                  }
              });
          }
      } catch (error) {
          console.error('Error parsing JSON:', error);
      }
  }
  
  const contentWithoutImages = content.replace(jsonRegex, '');

  return { contentWithoutImages, images };
}

export const Message = ({ env, role, content }) => {  
  const { user } = authModules[env.AUTH_TYPE](env.COOKIE_NAME);
  const [ displayName, setDisplayName ] = useState();
  const [ markdownContent, setMarkdownContent] = useState(content);
  const [ images, setImages] = useState([]);

  const settings = {
    customPaging: function(index) {
      const img = images[index];
      console.log('customPaging', img);
      return (
        <a>
          <img 
            src={img.thumbnail} 
            alt={img.alt} 
          />
        </a>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: false,
  };

  useEffect(() => {
    const { contentWithoutImages, images } = extractImagesFromMarkdown(content);
    console.log('images', images);
    setImages(images);
    setMarkdownContent(contentWithoutImages);
  }, [content]);

  useEffect(() => {
    let displayName = '?';

    if (role === 'user' && !!user) {
      displayName = user.name;
    }

    if (role === 'assistant') {
      displayName = env.AI_NAME;
    }

    setDisplayName(displayName);
  }, [env.AI_NAME, role, user]);

  return (
    <div className={`grid grid-cols-[30px_1fr] gap-5 p-5 ${role === 'assistant' ? 'bg-gray-600' : role === 'notice' ? 'bg-red-600' : ''}`}>
      <div className="flex items-start justify-center">
        {role === 'user' && !!user && (
          <Image 
            src={user.picture} 
            width={30}
            height={30}
            alt="User avatar" 
            className="rounded-full shadow-md shadow-black/50"
          />
        )}
        {role === 'assistant' && (
          <div className="flex items-center justify-center h-[30px] w-[30px] rounded-full shadow-md shadow-black/50 bg-gray-800">
            <FontAwesomeIcon icon={faRobot} className="text-emerald-200"/>
          </div>
        )}
      </div>
      <div className="">
        <div className="font-bold">{displayName}</div>
        <div className="prose prose-invert">
          <Markdown>
            { markdownContent }
          </Markdown>
          {images.length > 0 && 
            <div className="slider-container">
              <Slider {...settings}>
                {images.map((image, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-center" >
                      <img 
                        src={image.src} 
                        alt={image.alt} 
                        style={{width: "75%", height: "75%"}}
                      />
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
        }
        </div>
      </div>
    </div>
  )
};
