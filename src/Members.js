import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext";
import Member from "./Member";
import { Button } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

export default function Members(props) {

    const {data, setData} = useContext(MyContext);
    const [members, setMembers] = useState([]);
    const [toDel, setToDel] = useState([]);
    const {t} = useTranslation();

    useEffect(() => {
        setMembers(data.members);
    }, [data]);

    const delMember = (id) => {
        let newMembers = [];
        let currentToDel = [...toDel];
        members.forEach(member => {
            if (member.id !== id) {
                newMembers.push(member);
            } else {
                currentToDel.push(id);
            }
        });
        setMembers(newMembers);
        setToDel(toDel => [
            ...toDel,
            ...currentToDel
        ]);
    }

    const saveChanges = () => {
        let tmp = {...data};
        for (let i = 0; i < data.myLists.length; i++) {
            if (data.myLists[i].id === data.chosenList) {
                tmp.myLists[i].members = [];
                members.forEach(member => {
                    tmp.myLists[i].members.push(member.id);
                });
            }
        }
        saveRemote();
        setData(data => ({
            ...data,
            ...tmp
        }));
    }

    const saveRemote = async () => {
        let updated = {};
        let newMembers = [];
        props.setFetchState("Getting data from server.");
        await fetch('http://localhost:3001/initLists/' + data.chosenList, {
            method: "GET",
            mode: "cors"
        }).then(res => res.json()).then((oneList) => {
            props.setFetchState("Data acquired.");
            updated.id = oneList.id;
            updated.owner = oneList.owner;
            updated.name = oneList.name;
            updated.archived = oneList.archived;
            oneList.members.forEach(member => {
                toDel.forEach(delID => {
                    if (member !== delID) {
                        newMembers.push(member);
                    }
                });
            });
            updated.members = newMembers;})
            .catch((error) => {
                console.error(error);
                props.setFetchState("Error - see console.");
            });
        await fetch('http://localhost:3001/initLists/' + data.chosenList, {
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updated)
        })
        .then(() => {
            props.setFetchState("Members modified.");
        })
        .catch((error) => {
            console.error(error);
            props.setFetchState("Error - see console");
        });
    }

    const isOwn = () => {
        let own = false;
        data.myLists.forEach(myList => {
            if (myList.id === data.chosenList) {
                own = true;
            }
        });
        return own;
    }

    const provideSave = () => {
        if (isOwn()) {
            return(
                <Button variant="success" onClick={() => {
                    saveChanges();
                    props.showConfirm();
                    setTimeout(() => {
                        document.getElementById(data.chosenList).click();
                    }, 3);
                }}>{t('save_all_member_changes_btn')}</Button>
            )
        }
    }
    
    const leave = () => {
        let tmp = {...data};
        toDel.push(data.me.id);
        for(let i = 0; i < tmp.otherLists.length; i++) {
            if (typeof(tmp.otherLists[i]) !== "undefined"){
                if (tmp.otherLists[i].id === data.chosenList) {
                    tmp.otherLists.splice(i, 1);
                }
            }
        }
        saveRemote().then(() => {
            setData(data => ({
                ...data,
                ...tmp
            }));
            if (typeof(data.myLists[0]) !== "undefined") {
                document.getElementById(data.myLists[0].id).click();
            }
        });
    }

    const provideLeave = () => {
        let provide = false;
        data.otherLists.forEach(myList => {
            if (myList.id === data.chosenList) {
                provide = true;
            }
        });
        if (!isOwn() && data.chosenList !== "" && provide) {
            return(
                <Button variant="danger" onClick={() => {
                    leave();
                }}>Leave list</Button>
            )
        }
    }

    return(
        <>
        <table id="memberTable">
        <tbody>
            {members.map(member => {
                return(
                    <Member member={member} delMember={delMember} />
                )
            })}
            </tbody>
            </table>
            <br />
            {provideSave()}
            {provideLeave()}
        </>
    )
    
}