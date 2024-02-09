import { useContext, useState } from "react"
import { Button } from "react-bootstrap"
import { MyContext } from "./MyContext";
import { useTranslation } from 'react-i18next';

export default function Member(props) {

    const {data, setData} = useContext(MyContext);
    const {t} = useTranslation();

    const isMyList = () => {
        let ret = false;
        data.myLists.forEach(myList => {
            if (myList.id === data.chosenList) {
                ret = true;
            }
        });
        return ret;
    };

    const provideDelete = () => {
        if (isMyList()) {
            return(
                <>
                <Button variant="danger" onClick={() => props.delMember(props.member.id)}>{t('delete_usr_btn')}</Button>
                </>
            )
        }
    };

    return(
        <>
        <tr>
        <td>
        {props.member.name}
        </td><td>
        {provideDelete()}
        </td>
        </tr>
        </>
    )

}