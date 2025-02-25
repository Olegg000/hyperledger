import {useEffect, useState} from "react";
import {APILogin, getFine, payFine} from "../../API/api";
import {useDispatch, useSelector} from "react-redux";
import {RStore, setUser} from "../../Store/Store";
import {Users} from "../../Type/Types";


export const PayFine: React.FC = () => {
    const [licence,setLicence] = useState("")
    const [licenceFinesNum, setLicenceFinesNum] = useState<string[] | undefined>(undefined)
    const [correctFineNum,setCorrectFineNum] = useState(1)
    const dispatch = useDispatch();
    const user = useSelector((state: RStore) => state.auth)

    const payFineFunc = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation()
        const succes = await payFine(user.login,user.password,correctFineNum.toString(),licence)
        setLicence("")
        setLicenceFinesNum(undefined)
        setCorrectFineNum(1)
        if (succes) {
            const account = await APILogin(user.login, user.password);
            dispatch(setUser(account as Users));
            alert("Успешно")
        } else {
            alert("Что-то пошло не так")
        }
    }

    useEffect(() => {
        const tempConst = async () => {

            if (licence !== "" && user?.licence?.id === licence) {
                let fines:string[] = []
                for (let i = 1; i <= +user.licence.fines; i++) {
                    const fine =  await getFine(user.licence.id,i.toString());
                    console.log(fine);
                    fines.push(fine.id)
                }
                setLicenceFinesNum(fines)
            } else if (licence !== "" && user?.licence2?.id === licence) {
                let fines:string[] = []
                for (let i = 0; i < +user.licence2.fines; i++) {
                    const fine =  await getFine(user.licence2.id,i.toString());
                    console.log(fine);
                    fines.push(fine.id)
                }
                setLicenceFinesNum(fines)
            }
        }
        tempConst()
    }, [licence,user])

    return (
        <div>
        <p><strong>Оплатить штрафы</strong></p>
        {(user.licence2 === undefined && licence === "") ? <>{(() => {setLicence(user.licence?.id!)})()}</> : (
            user.licence2 === undefined ? <></>:
            <div>
                <input
                    style={{width:'200px'}}
                type="number"
                value={licence}
                placeholder="Выберите лицензию"
                onChange={(e) => {setLicence(e.target.value)}}
                min="000"
                step="111"
                max="666"
                required
                />
            </div>
        )}
        {(licenceFinesNum !== undefined && licenceFinesNum.length > 0) ? (<div>
            <form onSubmit={payFineFunc}>
                <select
                    value ={correctFineNum}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {setCorrectFineNum(+e.target.value)}}>
                    <option value="" disabled>Выберете штраф</option>
                    {licenceFinesNum?.map((fine,index) => (
                        <option key={fine} value={index}>Штраф {fine}</option>
                    ))}
                </select>
                <button type="submit">Оплатить</button>
            </form>
        </div>) : (<p>Штрафов нет</p>)}
    </div>)
}