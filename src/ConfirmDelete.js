import { useContext, useState } from "react";
import { MyContext } from "./MyContext";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

export default function ConfirmDelete(props) {

    const {data, setData} = useContext(MyContext);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { t } = useTranslation();
    const deleteList = () => {
        let myLists = [];
        let archived = [];
        let tmp = data;
        data.myLists.forEach(list => {
            if (list.id !== props.list.id) {
                myLists.push(list);
            }
        });
        data.archived.forEach(list => {
            if (list.id !== props.list.id) {
                archived.push(list);
            }
        });
        tmp.myLists = myLists;
        tmp.archived = archived;
        deleteRemote(props.list.id).then(() => {
            setData(data => ({
                ...data,
                ...tmp
            }));
            handleClose();
            getFirst();
        });   
    }

    const deleteRemote = async (id) => {
        props.setFetchState("Saving to server");
        await fetch('http://localhost:3001/initLists/' + id, {
            method: "DELETE",
            mode: "cors"
        }).then(() => {
            props.setFetchState("List deleted OK.")
        })
        .catch((error) => {
            props.setFetchState("Error, see console.")
            console.error(error);
        });
    }

    const getFirst = () => {
        if (typeof(data.myLists[0]) !== "undefined" && document.getElementById(data.myLists[0].id) !== null) {
            setTimeout(() => {
                document.getElementById(data.myLists[0].id).click();
            }, 3);
        }
    }

    return(
        <>
        <Button variant="danger" onClick={handleShow}>Delete me</Button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete list</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {t('durwt_dlt_list_lbl')} "{props.list.name}"?
            <Button variant="danger" onClick={() => {
                deleteList();
            }}>Yes, delete</Button>
            <Button variant="success" onClick={handleClose}>Close</Button>
          </Modal.Body>
        </Modal>
        </>
    )

}