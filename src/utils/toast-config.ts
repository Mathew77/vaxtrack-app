import { toast, ToastOptions, Bounce } from 'react-toastify';

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  transition: Bounce,
};

export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      ...defaultOptions,
      ...options,
      style: {
        background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
        color: '#155724',
        fontWeight: 500,
        ...options?.style,
      },
    });
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      ...defaultOptions,
      ...options,
      style: {
        background: 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
        color: '#721c24',
        fontWeight: 500,
        ...options?.style,
      },
    });
  },

  info: (message: string, options?: ToastOptions) => {
    toast.info(message, {
      ...defaultOptions,
      ...options,
      style: {
        background: 'linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%)',
        color: '#0c5460',
        fontWeight: 500,
        ...options?.style,
      },
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      ...defaultOptions,
      ...options,
      style: {
        background: 'linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%)',
        color: '#856404',
        fontWeight: 500,
        ...options?.style,
      },
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      pending: string;
      success: string;
      error: string;
    },
    options?: ToastOptions
  ) => {
    return toast.promise(
      promise,
      {
        pending: messages.pending,
        success: messages.success,
        error: messages.error,
      },
      {
        ...defaultOptions,
        ...options,
      }
    );
  },
};
