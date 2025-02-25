import {useState} from "react";
import {APILogin, setLicence} from "../../API/api";
import {RStore, setUser} from "../../Store/Store";
import {useDispatch, useSelector} from "react-redux";
import {Users} from "../../Type/Types";


export const SetLicence: React.FC = () => {
    const [licence1,setLicence1] = useState("")
    const user = useSelector((state: RStore) => state.auth)
    const dispatch = useDispatch();

    const licenceDo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
        console.log(licenceDo)
        console.log(user)
        const succes = await setLicence(user.login,user.password,licence1)
        if (succes) {
            alert("Успешно")
        } else {
            alert("Вы не можете присвоить себе эту лицензию")
        }
        const account = await APILogin(user.login, user.password);
        dispatch(setUser(account as Users));
        setLicence1("")
    }

    return (
        <div>
            <form onSubmit={licenceDo}>
                <p><strong>Установить себе лицензию</strong></p>
                <input
                    style={{width:"150px"}}
                    value={licence1}
                    type="number"

                    placeholder="Айди лицензии"
                    onChange={(e) => setLicence1(e.target.value)}
                    step="111"
                    min="000"
                    max="666"
                    required
                />
                <button type="submit">Установить</button>
            </form>
        </div>
    )
}