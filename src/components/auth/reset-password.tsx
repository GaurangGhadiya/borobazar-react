import Button from '@components/ui/button';
import Input from '@components/ui/form/input';
import Logo from '@components/ui/logo';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { useModalAction } from '@components/common/modal/modal.context';
import CloseButton from '@components/ui/close-button';
import PasswordInput from '@components/ui/form/password-input';
import { baseUrl } from '@framework/utils/http';
import axios from 'axios';
import { ErrorToast, SuccessToast } from '@framework/utils/Toast';

type FormValues = {
  confirmPassword: string;
  password: string;
};

const defaultValues = {
  confirmPassword: '',
  password: '',
};

const ResetPasswordform = () => {
  const { t } = useTranslation();
  const { closeModal, openModal } = useModalAction();
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
    if (values?.password !== values?.confirmPassword) {
      ErrorToast('Password and Confirm Password must be same');
    } else {
      axios
        .post(`${baseUrl}/user/reset_password`, {
          password: values?.password,
          id: localStorage.getItem('id'),
        })
        .then((response: any) => {
          console.log('response', response);
          SuccessToast(response?.data?.message);
          localStorage.removeItem('id');

          closeModal();
          return openModal('LOGIN_VIEW');
        })
        .catch((error: any) => {
          console.log('error', error);
          ErrorToast(error?.message);
        });
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
          {t('Create a new password')}
        </p>
      </div>
      <form
        onSubmit={handleSubmit((data) => onSubmit(data))}
        className="flex flex-col justify-center"
        noValidate
      >
        <PasswordInput
          label={t('forms:label-password')}
          {...register('password', {
            required: 'forms:password-required',
          })}
          className="mb-4"
          error={errors.password?.message}
        />
        <PasswordInput
          label={t('forms:label-confirm-password')}
          {...register('confirmPassword', {
            required: 'forms:password-required',
          })}
          error={errors.confirmPassword?.message}
          className="mb-4"
        />

        <Button
          type="submit"
          variant="formButton"
          className="h-11 md:h-12 w-full mt-0"
        >
          {t('common:text-reset-password')}
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

export default ResetPasswordform;
