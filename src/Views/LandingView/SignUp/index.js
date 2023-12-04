import React, { useRef, useState } from 'react';
import styles from './signUp.module.css';
import { Link } from 'react-router-dom';
import axios from '../../../Components/Shared/Axios';
import Aside from '../../../Components/Shared/Aside';
import TextInput from '../../../Components/Shared/TextInput';
import Button from '../../../Components/Shared/Button';
import Modal from '../../../Components/Shared/Modal';
import Spinner from '../../../Components/Shared/Spinner';
import { useStateContext } from '../../../Components/Contexts';

const SignUp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseModal, setResponseModal] = useState({
    description: ''
  });
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState({
    name: null,
    email: null,
    password: null,
    password_confirmation: null
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmRef.current.value
    };

    setIsLoading(true);

    try {
      const { data } = await axios.post('/signup', payload);
      setUser(data.user);
      setToken(data.token);
      setResponseModal({
        description: 'Usuario registrado correctamente'
      });
      setIsOpen(true);
    } catch (err) {
      if (err.response && err.response.status === 422) {
        const { errors: apiErrors } = err.response.data;

        setErrors({
          name: apiErrors.name?.[0] || null,
          email: apiErrors.email?.[0] || null,
          password: apiErrors.password?.[0] || null,
          password_confirmation: apiErrors.password_confirmation?.[0] || null
        });
      }
      setResponseModal({
        description: 'Ocurrió un error al registrar el usuario'
      });
      setIsOpen(true);
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <Spinner />}
      <Modal
        description={responseModal.description}
        isOpen={isOpen}
        close={() => setIsOpen(!isOpen)}
      />
      <Aside page={'home'} />
      <main>
        <section className={styles.container}>
          <div className={styles.subContainer}>
            <form className={styles.loginContainer} onSubmit={onSubmit}>
              <TextInput
                refrerence={nameRef}
                labelName={'Nombre'}
                placeholderText={'Escribe tu nombre'}
                error={errors.name}
              />
              <TextInput
                labelName={'E-mail'}
                refrerence={emailRef}
                placeholderText={'Escribe tu dirección de correo electrónico'}
                error={errors.email}
              />
              <TextInput
                refrerence={passwordRef}
                labelName={'Contraseña'}
                placeholderText={'Escribe tu contraseña'}
                error={errors.password}
              />
              <TextInput
                labelName={'Confirmar Contraseña'}
                refrerence={passwordConfirmRef}
                placeholderText={'Vuelve a escribir la contraseña'}
                error={errors.password_confirmation}
              />
              <Link to="/recoverPassword" className={styles.password}>
                <p>Olvidaste tu contraseña?</p>
              </Link>
              <div className={styles.btnContainer}>
                <Button type="submit" text="Enviar" />
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};

export default SignUp;
