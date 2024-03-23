import { EnterYourName } from './EnterYourName';
import { LoginSignup } from './LoginSignup';

export const AuthType = ({ authType }) => {
  return (
    <>
      {
        authType === 'auth0' && 
        <LoginSignup />
      }
      {
        authType === 'cookie' && 
        <EnterYourName />
      }
    </>
  )
};

