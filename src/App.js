import { useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import List from "./List";
import ItemList from "./ItemList";
import Members from "./Members";
import AddList from "./AddList";
import Button from "react-bootstrap/Button";
import ThemeSwitcher from "./ThemeSwitcher";
import './i18n';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';


export default function App() {

    const [data, setData] = useState({
        myLists: [],
        otherLists: [],
        archived: [],
        initItems: [],
        items: [],
        members: [],
        me: {},
        chosenList: ""
    });
    const [archived, setArchived] = useState(false);
    const [fetchState, setFetchState] = useState("");
    const { t } = useTranslation();
    // Preset some initial values
    const currentUser = {
            id: "jncsbjbshoidcug6879coi",
            name: "Franta Vomáčka"
        };
    let initLists = [];
    let initItems = [];
    let otherUsers = [];

    const getInitLists = async () => {
        setFetchState("Fetching data...");
        await fetch('http://localhost:3001/initLists', {
            method: "GET",
            mode: "cors"
        })
        .then(res => res.json())
        .then((data) => {
            setFetchState(t('data_acquired_ok'));
            initLists = data;
        })
        .catch((error) => {
            setFetchState("Error while fetching data.");
            console.error(error);
            initLists = [];
        });
    };

    const getInitItems = async () => {
        setFetchState("Fetching data...");
        await fetch('http://localhost:3001/initItems', {
            method: "GET",
            mode: "cors"
        })
        .then(res => res.json())
        .then((data) => {
            setFetchState(t('data_acquired_ok'));
            initItems = data;
        })
        .catch((error) => {
            setFetchState("Error while fetching data.");
            console.error(error);
            initItems = [];
        });
    };
 
    const getOtherUsers = async () => {
        setFetchState("Fetching data...");
        await fetch('http://localhost:3001/otherUsers', {
            method: "GET",
            mode: "cors"
        })
        .then(res => res.json())
        .then((data) => {
            setFetchState(t('data_acquired_ok'));
            otherUsers = data;
        })
        .catch((error) => {
            setFetchState("Error while fetching data.");
            console.error(error);
            otherUsers = [];
        });
    };

    useEffect(() => {
        let myLists = [];
        let otherLists = [];
        let archived = [];
        let items = [];
        let choosenList = "";
        let ou = [];
        getInitLists().then(() => {
            initLists.forEach(list => {
                if (list.owner === currentUser.id && !list.archived) {
                    myLists.push(list);
                } else if (list.archived) {
                    archived.push(list);
                }
                list.members.forEach(member => {
                    if (member === currentUser.id) {
                        otherLists.push(list);
                    }
                });
            });
            setData({
                myLists: myLists,
                otherLists: otherLists,
                archived: archived,
                initItems: initItems,
                items: [],
                members: [],
                me: currentUser,
                chosenList: choosenList,
                otherUsers: otherUsers
            });
        });
        getInitItems().then(() => {
            initItems.forEach(item => {
                if (item.listId === choosenList) {
                    items.push(item);
                }
            });
            setData({
                myLists: myLists,
                otherLists: otherLists,
                archived: archived,
                initItems: initItems,
                items: [],
                members: [],
                me: currentUser,
                chosenList: choosenList,
                otherUsers: otherUsers
            });
        });
        getOtherUsers().then(() => {
            otherUsers.forEach(user => {
                ou.push(user);
            })
            setData({
                myLists: myLists,
                otherLists: otherLists,
                archived: archived,
                initItems: initItems,
                items: [],
                members: [],
                me: currentUser,
                chosenList: choosenList,
                otherUsers: ou
            });
        });
    }, []);

    const getRelevantItems = (listId) => {
        let source = (data.initItems.length > 0) ? data.initItems: initItems;
        let items = [];
        source.forEach(item => {
            if (item.listId === listId) {
                items.push(item);
            }
        });
        return items;
    };

    const getRelevantMembers = (listId) => {
        let source = (data.otherUsers.length > 0) ? data.otherUsers: otherUsers;
        let members = [];
        data.myLists.forEach(list => {
            if (list.id === listId) {
                list.members.forEach(member => {
                    source.forEach(other => {
                        if (member === other.id) {
                            members.push(other);
                        }
                    });
                });
            }
        });
        data.otherLists.forEach(list => {
            if (list.id === listId) {
                list.members.forEach(member => {
                    otherUsers.forEach(other => {
                        if (member === other.id) {
                            members.push(other);
                        }
                    });
                });
            }
        });
        return members;
    };

    

    const toggleArchived = () => {
        if (!archived) {
            return(
                <>
                    <AddList setFetchState={setFetchState} />
                    <Button variant="secondary" onClick={() => setArchived(true)}>{t('see_archived_lists')}</Button>
                    <br /><br />
                    <h2>{t('your_lists')}:</h2>
                    {data.myLists.map(list => {
                        return(
                            <List list={list} items={getRelevantItems(list.id)} members={getRelevantMembers(list.id)} setFetchState={setFetchState} />
                        )
                    })}
                    <div className="floatDelimiter"></div>
                    <br />
                    <h2>{t('lists_youare_member_of')}:</h2>
                    {data.otherLists.map(list => {
                        return(
                            <List list={list} items={getRelevantItems(list.id)} members={getRelevantMembers(list.id)} setFetchState={setFetchState} />
                        )
                    })}
                </>
            )
        } else {
            return(
                <>
                    <Button variant="secondary" onClick={() => setArchived(false)}>{t('see_current_lists')}</Button>
                    <h2>{t('archived_lists')}:</h2>
                    {data.archived.map(list => {
                        return(
                            <List list={list} items={getRelevantItems(list.id)} members={getRelevantMembers(list.id)} archived="yes" setFetchState={setFetchState} />
                        )
                    })}
                </>
            )
        }
    };

    const showConfirm = () => {
        let conf = document.createElement("div");
        conf.id = "tempConfirm"
        conf.className = "confirmDiv"
        conf.innerHTML = "All changes saved OK"
        if (document.getElementById("temp") === null) {
            return;
        }
        document.getElementById("temp").innerHTML = conf.outerHTML;
        setTimeout(() => {
            const toDel = document.getElementById("tempConfirm");
            if (toDel !== null)
            {
                toDel.remove();
            }
        }, "500");
    }

    // Render
    return(
        <>
            
            <header id="mainhead">
            {t('shopping_list_header')}
            <div id="switchLangButton"><LanguageSwitcher/></div>
            <div id="darkLightbutton"><ThemeSwitcher/></div>
            </header>
            <MyContext.Provider value={{data,setData}}>
                <section id="listSec">
                <div id="serverResponse">{t('last_connection_state')}: {fetchState}</div>
                    {toggleArchived()}
                </section>
                <div id="rightSec">
                <section id="itemSec">
                    <h2>{t('items_in_the_selected_list')}:</h2>
                    <ItemList showConfirm={showConfirm} setFetchState={setFetchState} />
                </section>
                <hr />
                <section id="memberSec">
                    <h2>{t('members_of_the_selected_list')}:</h2>
                    <Members showConfirm={showConfirm} setFetchState={setFetchState} />
                </section>
                </div>
                <div class="floatDelimiter"></div>
            </MyContext.Provider>
            <footer id="foot">          
            </footer>
        </>
    )
    
}