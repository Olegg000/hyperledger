import {useState} from "react";
import {APILogin, setCar} from "../../API/api";
import {RStore, setUser} from "../../Store/Store";
import {useDispatch, useSelector} from "react-redux";
import {Users} from "../../Type/Types";


export const CarAdd: React.FC = () => {
    const user = useSelector((state: RStore) => state.auth);
    const [categoryNow, setCategoryNow] = useState<"A" | "B" | "C" | "">("");
    const [costPC, setCostPC] = useState("");
    const [howManyYearsUsed, setHowManyYearsUsed] = useState("");
    const dispatch = useDispatch();

    const funcCarAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const succes = await (setCar(user.login,user.password,categoryNow as "A" | "B" | "C",costPC,howManyYearsUsed))
        if (succes) {
            alert("Успешно!")
        } else {
            alert("Неправильно указана категория")
        }
        const account = await APILogin(user.login, user.password);
        dispatch(setUser(account as Users));
        setCostPC("");
        setHowManyYearsUsed("");
        setCategoryNow("A");
    }

    return (
        <div>
            <form onSubmit={funcCarAdd}>
                <p><strong>Добавить машину</strong></p>
                <select
                    style={{height:29}}
                    required
                value={categoryNow} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {setCategoryNow(e.target.value as "A" | "B" | "C")}}>
                    <option value="" disabled>Выберите категорию</option>
                    <option value="A">Категория A</option>
                    <option value="B">Категория B</option>
                    <option value="C">Категория C</option>
                </select>
                <input
                    style={{width:"200px"}}
                    value={costPC}
                    type="number"
                    placeholder="Цена автомобиля в PC"
                    onChange={(e) => setCostPC(e.target.value)}
                    step="1"
                    min="0"
                    required
                />
                <input
                    style={{width:"250px"}}
                    value={howManyYearsUsed}
                    type="number"
                    placeholder="Сколько лет используется?"
                    onChange={(e) => setHowManyYearsUsed(e.target.value)}
                    step="1"
                    min="0"
                    required
                />
                <button type="submit">Добавить</button>
            </form>
        </div>
    )
}