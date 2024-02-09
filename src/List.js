import { useContext } from "react";
import { MyContext } from "./MyContext";
import { Button } from "react-bootstrap";
import ConfirmDelete from "./ConfirmDelete";

export default function List(props) {

    const {data, setData} = useContext(MyContext);

    const chooseMe = () => {
        let tmp = data;
        tmp.chosenList = props.list.id;
        tmp.items = props.items;
        tmp.members = props.members;
        setData(data => ({
            ...data,
            ...tmp
        }));
    }

    const archiveMe = () => {
        let myLists = [];
        let otherLists = [];
        let tmp = data;
        data.myLists.forEach(myList => {
            if (myList.id !== props.list.id) {
                myLists.push(myList);
            }
        });
        data.otherLists.forEach(otherList => {
            if (otherList.id !== props.list.id) {
                otherLists.push(otherList);
            }
        });
        tmp.myLists = myLists;
        tmp.otherLists = otherLists;
        tmp.archived.push(props.list);
        setData(data => ({
            ...data,
            ...tmp
        }))
    };

    const getFirst = () => {
        if (typeof(data.myLists[0]) !== "undefined") {
        if (document.getElementById(data.myLists[0].id).click() !== null) {
        setTimeout(() => {
            document.getElementById(data.myLists[0].id).click();
        }, 3);
    }}}

    const provideArchive = () => {
        if (typeof(props.archived) === "undefined" && props.list.owner === data.me.id) {
            return(
                <>
                    <Button variant="primary" onClick={() => {
                        archiveMe();
                        getFirst();
                        }}>Archive me</Button>
                </>
            )
        }
    };

    const provideDelete = () => {
        if (props.list.owner === data.me.id) {
            return(
                <>
                    <ConfirmDelete list={props.list} setFetchState={props.setFetchState} />
                </>
            )
        }
    }

    let classname = (props.list.id === data.chosenList) ? "chosenList": "list";

    return(
        <>
        <div className={classname} onClick={chooseMe} id={props.list.id}>
            <div onClick={chooseMe}>
                <h3>{props.list.name}</h3>
            </div>
            {provideArchive()}<br />
            {provideDelete()}
        </div>
        </>
    )

}