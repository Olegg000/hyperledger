import React, {useState} from "react";
import {APILogin, licenceCategoryAdd} from "../../API/api";
import {useDispatch, useSelector} from "react-redux";
import {RStore, setUser} from "../../Store/Store";
import {Users} from "../../Type/Types";


export const CategoryAdd: React.FC = () => {
    const user = useSelector((state: RStore) => state.auth);
    const [categoryNow, setCategoryNow] = useState<"A" | "B" | "C" | "">("");
    const dispatch = useDispatch();

    const categoryAddFunc = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const succes = await licenceCategoryAdd(user.login,user.password,categoryNow as "A" | "B" | "C")
        if (succes) {
            alert("Успешно");
        } else {
            alert("Что-то пошло не так")
        }
        const account = await APILogin(user.login, user.password);
        dispatch(setUser(account as Users));
        setCategoryNow("");
    }

    return (
        <div>
            <form onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {await categoryAddFunc(e)}}>
                <p><strong>Добавить категорию</strong></p>
                <select
                    style={{height:29}}
                    required
                    value={categoryNow} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {setCategoryNow(e.target.value as "A" | "B" | "C")}}>
                    <option value="" disabled>Выберите категорию</option>
                    <option value="A">Категория A</option>
                    <option value="B">Категория B</option>
                    <option value="C">Категория C</option>
                </select>
                <button type="submit">Добавить</button>
            </form>
        </div>
    )
}