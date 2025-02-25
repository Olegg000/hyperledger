import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {RStore, setUser} from "../../Store/Store";
import {APILogin, licenceDataAdd} from "../../API/api";
import {Users} from "../../Type/Types";


export const LicenceDataAddComp: React.FC = () => {
    const user = useSelector((state: RStore) => state.auth)
    const dispatch = useDispatch();

    const licenceDataAddFunc = async () => {
        if (user.licence !== undefined) {
            const succes = await licenceDataAdd(user.login, user.password, user.licence.id);
            if (succes) {
                const account = await APILogin(user.login, user.password);
                dispatch(setUser(account as Users));
                alert("Успешно")
            } else {
                alert("Неуспешно")
            }
        }
    }

    return (
        <div>
            <p><strong>Продлить удостоверение</strong></p>
        <button onClick={async() => {await licenceDataAddFunc()}}>Продлить удостоверение</button>
    </div>)
}