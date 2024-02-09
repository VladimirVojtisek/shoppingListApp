import { Button } from "react-bootstrap";
import { useTranslation } from 'react-i18next';



export default function Item(props) {

    let classname = (props.done) ? "done": "";
    const { t } = useTranslation();
    const provideDone = () => {
        let provide = (!props.done) ? <Button variant="success" onClick={() => props.markDone(props.id)}>{t('mark_done_btn')}</Button>: "";
        return provide;
    }

    const provideDelete = () => {
        if (props.display){
            return(
                <Button variant="danger" onClick={() => props.delItem(props.id)}>{t('delete_btn')}</Button>
            )
        }
    }

    return(
        <>
        <tr>
          <td><span class={classname}>{props.name} {props.amount} {props.units}</span></td>
          <td>{provideDone()}</td>
          <td>{provideDelete()}</td>
          </tr>
        </>
    )
}