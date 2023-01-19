import toast from 'react-hot-toast';

export const SuccessToast = (message: string) => {
  return toast.success(message, {
    style: {
      padding: '16px',
      fontSize: '14px',
      //   background: '#2E3438',
      //   color: '#fff',
    },
  });
};

export const ErrorToast = (message: string) => {
  return toast.error(message, {
    style: {
      padding: '16px',
      fontSize: '14px',
      //   background: '#2E3438',
      //   color: '#fff',
    },
  });
};
