import React from "react";
import {RStore} from "../../Store/Store";
import {useSelector} from "react-redux";
import {DPCComponent} from "../DPSComponent/DPSComponent";

export const IsLoginTrue: React.FC = () => {
    const user = useSelector((state: RStore) => state.auth);
    const bank = useSelector((state: RStore) => state.bank);

    return (
        <div style={{display: "flex", alignItems: "flex-start",flexDirection: "column"}}>

            <p style={{margin: "1px"}}>Пользователь: <strong>{bank.balancePC !== undefined ? "Bank" : user?.fio || user?.login}</strong></p>

            <p style={{margin: "1px"}}>{bank.balancePC !== undefined ? "" : `Cтаж: ${user.skillYears ? `${user.skillYears} лет` : "нет"}`}</p>

            <p style={{margin: "1px"}}>Баланс ProfiCoin: {bank.balancePC !== undefined ? `${bank.balancePC}` : `${user.balancePC}`}</p>

            <p style={{margin: "1px"}}>{bank.balancePC !== undefined ? "" : `Лицензия: ${user?.licence?.category ?
                `${user.licence?.id} категории ${user.licence.category} ${user.licence.category2 ? `, ${user.licence.category2}`: ""}
            , действующая до ${user.licence.validity}.${+user.licence.fines > 0 ? "Штрафы имеются" : "Штрафов нет"}` : "нет"}`}</p>

            <p style={{margin: "1px"}}>{(bank.balancePC !== undefined && user.licence === undefined && user.licence2 === undefined) ? "" : `Лицензия 2: ${user.licence2?.category ?
                `${user.licence2.id} категории ${user.licence2.category} ${user.licence2.category2 ? `, ${user.licence2.category2}`: ""}
            , действующая до ${user.licence2.validity}.${+user.licence2.fines > 0 ? "Штрафы имеются" : "Штрафов нет"}` : "нет"}`}</p>

            <p style={{margin: "1px"}}>{bank.balancePC !== undefined ? "" : `Машины: ${user?.car?.category ?
                `категории ${user.car.category}, по цене ${user.car.costPC} PC
            , используется ${user.car.howManyYearsUsed} лет` : "нет"}`}</p>

            <p style={{margin: "1px"}}> <strong>{bank.balancePC !== undefined ? "" :
                `${user.isDPS ?`Аккаунт ДПС` : ``}`}</strong></p>
            {user.isDPS && ( <div>
                <DPCComponent/>
            </div>)}
        </div>
    )
}