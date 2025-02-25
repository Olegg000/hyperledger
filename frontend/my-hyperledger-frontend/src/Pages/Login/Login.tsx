import {useEffect, useState} from "react";
import {APIGetBankBalance, APILogin, userReg} from "../../API/api";
import {useDispatch, useSelector} from "react-redux";
import {setBank, setUser, RStore, delUser, delBank} from "../../Store/Store";
import {Bank, Users} from "../../Type/Types";
import {IsLoginTrue} from "../../Components/IsLoginTrue/IsLoginTrue";
import {SetLicence} from "../../Components/SetLicence/SetLicence";
import {CarAdd} from "../../Components/CarAdd/CarAdd";
import {LicenceDataAddComp} from "../../Components/LicenceDataAddComp/LicenceDataAddComp";
import {PayFine} from "../../Components/PayFine/PayFine";
import {CategoryAdd} from "../../Components/CategoryAdd/CategoryAdd";

export const Login: React.FC = () => {
    const dispatch = useDispatch();
    const [login,setlogin] = useState("");
    const [password, setpassword] = useState("");
    const [isLogin, setIsLogin] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState("");
    const [father, setFather] = useState("");
    const [surname, setSurname] = useState("");
    const [skillYears, setSkillYears] = useState("");
    const user = useSelector((state: RStore) => state.auth)
    const bank = useSelector((state: RStore) => state.bank)

    const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            if (!isLogin) {
                if (login !== "bank" && password !== "bank") {
                    const account = await APILogin(login, password);

                    if (account.login !== undefined) {
                        dispatch(setUser(account as Users));
                        setIsLogin(true);
                    }  else {
                        alert(`Попробуйте ввести свои данные ещё раз`);
                    }
                } else {
                    const bankBalance = await APIGetBankBalance(login, password);
                    dispatch(setBank(bankBalance));
                    setIsLogin(true);
                }
            }
        } catch (e) {
            alert(`Попробуйте ввести свои данные ещё раз`);
            console.log(e);
        }
        setlogin("");
        setpassword("");
    }
    
    const switchReg = async () => {
        setlogin("");
        setpassword("");
        setIsRegister(true);
    }

    const registrUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            if (!isLogin) {
                const fio = surname + " " + name + " " + father;
                const succes = await userReg(login,password,fio,skillYears.toString());
                if (succes) {
                    alert("Успешно зарегистрировано!")
                    setIsRegister(false);
                } else {
                    alert("Что-то пошло не так")
                }
            }
        } catch (e) {
            alert("Что-то пошло не так")
            console.log(e);
        }
        setlogin("")
        setpassword("")
        setName("");
        setFather("");
        setSurname("");
        setSkillYears("");
    }

    const logOutUser = async () => {
        try {
            setlogin("")
            setpassword("")
            dispatch(delBank())
            dispatch(delUser())
            setIsLogin(false);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div>
            {!isLogin && !isRegister && (
                <div >
            <form style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column",
                padding: "50px", border: "1 px solid #ccc", borderRadius: "8px" }} onSubmit={loginUser}>
                <p style={{margin: "1px"}}><strong>Войти</strong></p>
                <input
                    name="login"
                    value={login}
                    type="string"
                    placeholder="Введите логин"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setlogin(e.target.value);
                    }}
                    required
                />
                <input
                    name="password"
                    value={password}
                    type="string"
                    placeholder="Введите пароль"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setpassword(e.target.value);
                    }}
                    required
                    />
                <button style={{width: "189px"}} type="submit">Подтвердить</button>
                <br/>
                <button onClick={switchReg} style={{height: "30px"}}>Зарегистрироваться</button>
            </form>
                </div>
            )}

            {!isLogin && isRegister && (
                <div >
                    <form style={{display: "flex", justifyContent: "center", alignItems: "center",
                        flexDirection: "column", padding: "50px", border: "1 px solid #ccc", borderRadius: "8px" }} onSubmit={registrUser}>
                        <p style={{margin: "1px"}}><strong>Зарегистрироваться</strong></p>
                        <input
                            name="login"
                            value={login}
                            type="string"
                            placeholder="Введите логин"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setlogin(e.target.value);
                            }}
                            required
                        />
                        <input
                            name="password"
                            value={password}
                            type="string"
                            placeholder="Введите пароль"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setpassword(e.target.value);
                            }}
                            required
                        />
                        <input
                            name="name"
                            value={name}
                            type="string"
                            placeholder="Введите имя"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setName(e.target.value);
                            }}
                            required
                        />
                        <input
                            name="surname"
                            value={surname}
                            type="string"
                            placeholder="Введите фамилию"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setSurname(e.target.value);
                            }}
                            required
                        />
                        <input
                            name="father"
                            value={father}
                            type="string"
                            placeholder="Введите отчество"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFather(e.target.value);
                            }}
                            required
                        />
                        <input  
                            value= {skillYears}
                            type = "string"
                            placeholder= "Введите стаж"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setSkillYears(e.target.value);
                            }}
                            min="0"
                            step="1"
                            required
                        />
                        <button style={{width: "189px"}} type="submit">Подтвердить</button>
                    </form>
                </div>
                )}

            {isLogin && (
                <div>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <div>
                        <IsLoginTrue />
                    </div>
                    <div style={{display: "flex", justifyContent: "left", alignItems: "flex-start"}}>
                        <button onClick={logOutUser}>Выйти</button>
                    </div>
                </div>
                <div>
                    <p><strong>-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~</strong></p>
                    <br/>
                    {user.licence === undefined ? (
                        (bank.balancePC !== undefined) ? (<></>): (<SetLicence/>)
                    ) : (
                        <div>
                        {user.car === undefined ? (<CarAdd/>
                        ) : (<div></div>)}
                            <br/>
                            <br/>
                            <LicenceDataAddComp/>
                            <br/>
                            <br/>
                            {user.licence.category2 === undefined ? (<div> <CategoryAdd/> <br/> <br/></div> ) : (<></>)}
                        </div>
                    )}
                    {user.licence !== undefined && user.licence2 === undefined && (
                        <SetLicence/>
                    )}

                    <br/>
                    <br/>
                    {user.licence !== undefined && user.licence?.fines !== undefined ? (
                    <PayFine/>) : (<></>)}
                    </div>
                </div>
            )}
        </div>
    )
}
