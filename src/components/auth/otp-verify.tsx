import * as React from 'react';
import Button from '@components/ui/button';
import Input from '@components/ui/form/input';
import Logo from '@components/ui/logo';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { useModalAction } from '@components/common/modal/modal.context';
import CloseButton from '@components/ui/close-button';
import OtpInput from 'react-otp-input';
import { ErrorToast, SuccessToast } from '@framework/utils/Toast';
import { baseUrl } from '@framework/utils/http';
import axios from 'axios';

type FormValues = {
  email: string;
};

const defaultValues = {
  email: '',
};

const OtpVerifyForm = () => {
  const { t } = useTranslation();
  const { closeModal, openModal } = useModalAction();
  const [otp, setOtp] = React.useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  function handleSignIn() {
    return openModal('LOGIN_VIEW');
  }

  const onSubmit = (values: FormValues) => {
    console.log(values, 'token');
    if (!otp) {
      ErrorToast('OTP is required');
    } else if (otp?.length < 6) {
      ErrorToast('OTP must been 6 digits');
    } else {
      axios
        .post(`${baseUrl}/user/otp_verification`, {
          otp,
          email: localStorage.getItem('reset_email'),
        })
        .then((response: any) => {
          console.log('response', response);
          SuccessToast(response?.data?.message);
          localStorage.removeItem('reset_email');
          localStorage.setItem('id', response?.data?.data?._id);
          closeModal();
          return openModal('RESET_PASSWORD');
        })
        .catch((error: any) => {
          console.log('error', error);
          ErrorToast(error?.message);
        });
      // SuccessToast('OTP verify sucessfull');
    }
  };

  return (
    <div className="py-6 px-5 sm:p-8 bg-skin-fill mx-auto rounded-lg w-full sm:w-96 md:w-450px">
      <CloseButton onClick={closeModal} />
      <div className="text-center mb-9 pt-2.5">
        <div onClick={closeModal}>
          <Logo />
        </div>
        <p className="text-sm md:text-base text-body mt-3 sm:mt-4 mb-8 sm:mb-10">
          {t('Verify your OTP')}
        </p>
      </div>
      <form
        onSubmit={handleSubmit((data) => onSubmit(data))}
        className="flex flex-col justify-center"
        noValidate
      >
        <OtpInput
          value={otp}
          onChange={(otp: any) => setOtp(otp)}
          numInputs={6}
          separator={<span style={{ margin: '0 9px' }}>-</span>}
          inputStyle={{ height: '2.5em', width: '2.7em', border: '1px solid' }}
          containerStyle={{ marginBottom: '30px' }}
          isInputNum={true}
          hasErrored={true}
        />
        {/* <Input
          label={t('OTP')}
          type="email"
          variant="solid"
          className="mb-4"
          {...register('email', {
            required: `${t('forms:email-required')}`,
            pattern: {
              value:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: t('forms:email-error'),
            },
          })}
          error={errors.email?.message}
        /> */}

        <Button
          type="submit"
          variant="formButton"
          className="h-11 md:h-12 w-full mt-0"
        >
          {t('Verify OTP')}
        </Button>
      </form>
      <div className="flex flex-col items-center justify-center relative text-sm text-heading mt-8 sm:mt-10 mb-6 sm:mb-7">
        <hr className="w-full border-gray-300" />
        <span className="absolute -top-2.5 px-2 bg-skin-fill">
          {t('common:text-or')}
        </span>
      </div>
      <div className="text-sm sm:text-15px text-skin-muted text-center">
        {t('common:text-back-to')}{' '}
        <button
          type="button"
          className="text-skin-base underline font-medium hover:no-underline focus:outline-none"
          onClick={handleSignIn}
        >
          {t('common:text-login')}
        </button>
      </div>
    </div>
  );
};

export default OtpVerifyForm;
