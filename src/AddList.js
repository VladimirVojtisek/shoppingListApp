import { useContext, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { MyContext } from './MyContext';
import { sha256 } from 'js-sha256';
import { useTranslation } from 'react-i18next';


export default function AddList(props) {

    const [show, setShow] = useState(false);
    const {data, setData} = useContext(MyContext);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const {t} = useTranslation();

    const handleSubmit = (event) => {
        let tmp = data;
        let date = new Date();
        let hash = sha256.create();
        let id = hash.update(date.getTime().toString()).hex();
        event.preventDefault();
        console.debug(event.target[0].value);
        let toStore = {
            id: id,
            name: event.target[0].value,
            owner: data.me.id,
            members: [],
            archived: false
        };
        tmp.myLists.push(toStore);
        storeRemote(toStore).then(() => {
            setData(data => ({
                ...data,
                ...tmp
            }));
            handleClose();
        });
    };

    const storeRemote = async (data) => {
        props.setFetchState("Sending data to server...")
        await fetch('http://localhost:3001/initLists', {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(() => {
            props.setFetchState("New list stored OK.")
        })
        .catch((error) => {
            props.setFetchState("Error, see console.")
            console.error(error);
        });
    }

    return(
        <>
        <Button variant="primary" onClick={handleShow}>
        {t('add_new_list_btn')}
        </Button>

        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Add a new list</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form action="#" onSubmit={handleSubmit}>
                <input type="text" className="form-control" placeholder="New list name" />
                <input type="submit" value="Save" className='btn btn-primary' />
            </form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
            Close
        </Button>
        </Modal.Footer>
        </Modal>
        </>
    )

}