import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext";
import Item from "./Item";
import { sha256 } from "js-sha256";
import { Button } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

export default function ItemList(props) {
    
    const {data, setData} = useContext(MyContext);
    const [items, setItems] = useState([]);
    const [toAdd, setToAdd] = useState([]);
    const [toDel, setToDel] = useState([]);
    const [toDone, setToDone] = useState([]);
    const {t} = useTranslation();

    let display = false;

    data.myLists.forEach(list => {
        if (list.id === data.chosenList && list.owner === data.me.id) {
            display = true;
        }
    });

    useEffect(() => {
        setItems(data.items);
    },[data]);

    const markDone = (id) => {
        let newItems = [];
        let currentToDone = [...toDone];
        items.forEach(item => {
            if (item.id === id) {
                item.done = true;
                newItems.push(item);
                currentToDone.push(id);
            } else {
                newItems.push(item);
            }
        });
        setItems(newItems);
        setToDone(toDone => [
            ...toDone,
            ...currentToDone
        ])
    };

    const delItem = (id) => {
        let newItems = [];
        let copyItems = [...items];
        let currentDel = [...toDel];
        copyItems.forEach(item => {
            if (item.id !== id) {
                newItems.push(item);
            }
        });
        currentDel.push(id);
        setItems([...newItems]);
        setToDel(toDel => ([
            ...toDel,
            ...currentDel
        ]));
    };

    const provideAddItem = () => {
        if (data.chosenList !== "" && display) {
            return(
                <>
                <form action="#" onSubmit={addItem}>
                  <input type="text" className="form-control" placeholder={t('add_new_item_lbl')}/>
                  <input type="text" className="form-control" placeholder={t('set_amount_lbl')}/>
                  <input type="text" className="form-control" placeholder={t('what_unit_lbl')}/>
                  <input type="submit" className="btn btn-primary" value={t('add_new_item_lbl')}/>
                  <span>{t('all_flds_filled_lbl')}</span>
                </form><br />
                </>
            )
        }
    }

    const addItem = (event) => {
        event.preventDefault();
        if (!event.target[0].value || !event.target[1].value || !event.target[2].value) {
            return;
        }
        let currentAdd = [...toAdd];
        let hash = sha256.create();
        let date = new Date();
        let newItems = [...items];
        let id = hash.update(date.getTime().toString()).hex();
        newItems.push({
            id: id,
            name: event.target[0].value,
            amount: event.target[1].value,
            units: event.target[2].value,
            listId: data.chosenList,
            done: false
        });
        currentAdd.push(newItems[newItems.length - 1]);
        setItems(newItems);
        setToAdd(toAdd => ([
            ...toAdd,
            ...currentAdd
        ]));
    };

    const saveChanges = () => {
        let tmp = data;
        let newInitItems = [];
        let toStore = {};
        data.initItems.forEach(initItem => {
            if (initItem.listId !== data.chosenList) {
                newInitItems.push(initItem);
            }
        });
        items.forEach(item => {
            newInitItems.push(item);
            toStore = item;
        });
        tmp.initItems = newInitItems;
        remoteSave().then(() => {
            setData(data=> ({
                ...data,
                ...tmp
            }));
        });
    };

    const remoteSave = async () => {
        for (let i = 0; i < toAdd.length; i++) {
            props.setFetchState("Saving data to server.");
            await fetch('http://localhost:3001/initItems', {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(toAdd[i])
            })
            .then(() => {
                props.setFetchState("Data stored to server OK.")
            })
            .catch((error) => {
                console.error(error);
                props.setFetchState("Error, see console.")
            });
        }
        setToDel([]);
        for (let i = 0; i < toDel.length; i++) {
            props.setFetchState("Saving data to server.");
            await fetch('http://localhost:3001/initItems/' + toDel[i], {
                method: "DELETE",
                mode: "cors"
            })
            .then(() => {
                props.setFetchState("Data stored to server OK.")
            })
            .catch((error) => {
                console.error(error);
                props.setFetchState("Error, see console.")
            });
        }
        setToAdd([]);
        for (let i = 0; i < toDone.length; i++) {
            props.setFetchState("Saving data to server.");
            await fetch('http://localhost:3001/initItems/' + toDone[i], {
                method: "PATCH",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({"done": true})
            })
            .then(() => {
                props.setFetchState("Data stored to server OK.")
            })
            .catch((error) => {
                console.error(error);
                props.setFetchState("Error, see console.")
            });
        }
        setToDone([]);
    }

    const provideSave = () => {
        if (data.chosenList !== "" && display) {
            return(
                <Button variant="success" onClick={() => {
                    saveChanges();
                    props.showConfirm();
                    setTimeout(() => {
                        document.getElementById(data.chosenList).click();
                    }, 300);
                }}>{t('save_all_item_chgs_btn')}</Button>
            )
        }
    }

    return(
        <>
            {provideAddItem()}
            <table id="itemTable">
            <tbody>
            {items.map(item => {
                return(
                <Item id={item.id} name={item.name} amount={item.amount} units={item.units} done={item.done} markDone={markDone} delItem={delItem} display={display} />
                )
            })}
            </tbody>
            </table>
            <br />
            {provideSave()}
        </>
    )

}