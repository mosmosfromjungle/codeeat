import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

type ToastProps = {
  toastAnimation?: string;
  text: string;
};

export const FadeToast: React.FC<ToastProps> = (props: ToastProps) => {
  const { toastAnimation, text } = props;

  return (
    <div className={toastAnimation}>
      <Wrapper>
        <FadeToastBox>
          <Msg>
            <p>{text}</p>
          </Msg>
        </FadeToastBox>
      </Wrapper>
    </div>
  );
};

export const WelcomeToast: React.FC = () => {
  const [toastState, setToastState] = useState(true);
  const [toastAnimation, setToastAnimation] = useState('toast-alert');

  useEffect(() => {
    const timer = setTimeout(() => {
      setToastAnimation('toast-alert');
      setToastState(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);
  if (toastState) {
    const text = 'Welcome to 🏖ParaSolo🏖';
    return <FadeToast toastAnimation={toastAnimation} text={text} />;
  }
  return null;
};

export const AlertToast: React.FC<ToastProps> = (props: ToastProps) => {
  const { text } = props;
  const [toastState, setToastState] = useState<boolean>(true);
  const [toastAnimationClass, setToastAnimationClass] = useState<string>('open');

  useEffect(() => {
    const timer = setTimeout(() => {
      setToastAnimationClass('close');
      // setToastState(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (toastState) {
    return (
      <AlertToastContainer animation={toastAnimationClass}>
        <p>{text}</p>
      </AlertToastContainer>
    );
  }

  return null;
};

export const LeftToast: React.FC<ToastProps> = (props: ToastProps) => {
  const { text } = props;
  const [toastState, setToastState] = useState<boolean>(true);
  const [toastAnimationClass, setToastAnimationClass] = useState<string>('open');

  useEffect(() => {
    const timer = setTimeout(() => {
      setToastAnimationClass('close');
      // setToastState(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (toastState) {
    return (
      <LeftToastContainer animation={toastAnimationClass} color='white'>
        <p>{text}</p>
      </LeftToastContainer>
    );
  }

  return null;
};

const boxFade = keyframes`
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
    `;

const Wrapper = styled.div`
  position: fixed;
  top: 85%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const FadeToastBox = styled.div`
  gap: 10px;
  bottom: 60px;
  height: 200px;
  width: 500px;
  animation: ${boxFade} 2s 1s;
`;

const Msg = styled.div`
  background: white;
  border-radius: 10px;
  padding: 15px 35px 15px 15px;
  font-size: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  font-weight: bold;
  justify-content: center;
  text-align: center;
`;

type AnimationProps = {
  animation: string;
  color?: string;
};

const AlertToastContainer = styled.div<AnimationProps>`
  position: fixed;
  top: 10%;
  right: 0;
  background: ${(props) => (props.color ? props.color : 'blue')};
  border-radius: 10px;
  font-size: 20px;
  display: flex;
  align-items: center;
  text-align: center;
  font-weight: bold;
  justify-content: center;
  text-align: center;
  min-width: 200px;
  height: 100px;
  padding-left: 20px;
  padding-right: 20px;

  @keyframes slideIn {
    from {
      right: -100%;
    }
    to {
      right: 50%;
      transform: translate(50%);
    }
  }

  @keyframes slideOut {
    from {
      right: 50%;
      transform: translate(50%);
    }
    to {
      right: -100%;
    }
  }

  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;

  animation: ${(props) =>
    props.animation === 'open' ? 'slideIn 0.5s forwards' : 'slideOut 0.5s forwards'};

  -webkit-animation: ${(props) =>
    props.animation === 'open' ? 'slideIn 0.5s forwards' : 'slideOut 0.5s forwards'};
`;

const LeftToastContainer = styled.div<AnimationProps>`
  position: fixed;
  top: 2%;
  left: 0;
  background: ${(props) => (props.color ? props.color : 'blue')};
  border-radius: 10px;
  font-size: 20px;
  display: flex;
  align-items: center;
  text-align: center;
  font-weight: bold;
  justify-content: center;
  text-align: center;
  min-width: 200px;
  height: 100px;
  padding-left: 20px;
  padding-right: 20px;

  @keyframes slideIn {
    from {
      left: -100%;
    }
    to {
      left: 5%;
    }
  }

  @keyframes slideOut {
    from {
      left: 5%;
    }
    to {
      left: -100%;
    }
  }

  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;

  animation: ${(props) =>
    props.animation === 'open' ? 'slideIn 0.5s forwards' : 'slideOut 0.5s forwards'};

  -webkit-animation: ${(props) =>
    props.animation === 'open' ? 'slideIn 0.5s forwards' : 'slideOut 0.5s forwards'};
`;
