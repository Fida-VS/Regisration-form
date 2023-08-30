import styles from './App.module.css';
import { useState, useRef } from 'react';
import { InitialState } from './constants';
 
const useStore = () => {
	const [state, setState] = useState(InitialState);
	return {
		getState: () => state,
		updateState: (fieldName, newValue) => {
			setState({...state, [fieldName]: newValue})
		},
	};
}

const sendData = (formData) => {
console.log(formData);
}



export const App = () => {

	const [inputError, setInputError] = useState(null);
	const [emailDirty, setEmailDirty] = useState(false);
	const [passwordDirty, setPasswordDirty] = useState(false);
	const {getState, updateState} = useStore();



	const submitButtonRef = useRef(null);
	const passwordRef = useRef(null);
	const repeatedPasswordRef = useRef(null);
	

	const onSubmit = (event) => {
		event.preventDefault();
		sendData(getState());
	};

	
	const {email, password, repeatedPassword} = getState();

	const onChange = ({ target }) => {
		
		 let error = null;
		if(target.name === 'email' && !/^[\w_@.]*$/.test(target.value)){
			error = 'Допустимые символы - буквы, цифры, нижнее подчёркивание, точка и @';
		} else if(target.value.length > 30){
			error = 'Должно быть не больше 30 символов';
		} else if (target.name === 'password' && !/^[\wW_#.]*$/.test(target.value)){
			error = 'Допустимые символы - буквы, цифры, нижнее подчёркивание, решётка и точка';
		} 
		
		setInputError(error);

		updateState(target.name, target.value);


		if(repeatedPasswordRef.current.value === passwordRef.current.value && error === null && emailDirty === true && passwordDirty === true){
			submitButtonRef.current.focus();
		} 

	};
	
	const onBlur = ({target}) => {
		switch (target.name){
			case 'email': 
			setEmailDirty(true)
			break;
			case 'password':
				setPasswordDirty(true)
				break;
					default:
                     break;
		}

		let blurError = null;
		if(target.name !== 'repeatedPassword' && target.value.length < 3){
			blurError = 'Должно быть не меньше 3 символов';
		} else if(target.name === 'repeatedPassword' && target.value !== password){
			blurError = 'Повторите пароль';
		} 

		setInputError(blurError);
	}

	return (
		<div className={styles.app}>
			<form onSubmit={onSubmit}>
				{inputError && <div className={styles.errorLabel}>{inputError}</div>}
				<label>Почта:</label><input
					type="email"
					name="email"
					value={email}
					placeholder="Введите адрес электронной почты"
					onChange={onChange}
					onBlur={onBlur}
				></input>
				<label>Пароль:</label><input
					type="password"
					name="password"
					value={password}
					placeholder="Введите пароль"
					onChange={onChange}
					onBlur={onBlur}
					ref={passwordRef}
				></input>
				<label>Повторный ввод пароля:</label><input
					type="password"
					name="repeatedPassword"
					value={repeatedPassword}
					placeholder="Повторите пароль"
					onChange={onChange}
					onBlur={onBlur}
					ref={repeatedPasswordRef}
				></input>
				<button ref={submitButtonRef} className={styles.buttonSubmit} type="submit" disabled={inputError !== null}>Зарегистрироваться</button>
			</form>
		</div>
	);
};
