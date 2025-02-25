import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RStore, setUser} from "../../Store/Store";
import {APILogin, setFine} from "../../API/api";
import {Users} from "../../Type/Types";


export const DPCComponent: React.FC = () => {
    const [licenceNum, setLicenceNum] = useState("");
    const user = useSelector((state: RStore) => state.auth);
    const dispatch = useDispatch();

    const Fine = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
        const succes = await setFine(user.login,user.password,licenceNum)
        if (succes) {
            alert("Успешно")
        } else {
            alert("Что-то пошло не так")
        }
        const account = await APILogin(user.login, user.password);
        dispatch(setUser(account as Users));
        setLicenceNum("");
    }

    return (
        <div>
            <form onSubmit={Fine}>
                <p><strong>Выписать штраф</strong></p>
                <input
                    style={{width:"150px"}}
                    value={licenceNum}
                    type="number"
                    placeholder="Айди лицензии"
                    onChange={(e) => setLicenceNum(e.target.value)}
                    step="111"
                    min="000"
                    max="666"
                    required
                />
                <button type="submit">Выписать</button>
            </form>
        </div>
    )
}