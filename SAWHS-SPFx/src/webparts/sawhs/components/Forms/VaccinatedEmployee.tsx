import * as React from 'react';
// import styles from './Sawhs.module.scss';
import { PrimaryButton, Toggle } from '@fluentui/react';
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react/lib/ChoiceGroup';
import { useState } from 'react';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IItemAddResult } from "@pnp/sp/items";
import { graph } from '@pnp/graph';
import "@pnp/graph/users";

const amountOfDosesChoice: IChoiceGroupOption[] = [
    { key: '1', text: '1' },
    { key: '2', text: '2' },
    { key: '3', text: '3' },
    { key: '4', text: '4' },
];

export default function VaccinatedEmployee(){
    const [isVaccinated, setIsVaccinated] = useState(false);
    const [amountOfDoses, setAmountOfDoses] = useState(1);
    const [loggedInUser, setLoggedInUser] = useState("");

    async function _getUserInfo() {
        var user = await graph.me();
        setLoggedInUser(user.displayName);
    }
    _getUserInfo();

    function _setAmountOfDoses(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption){
        setAmountOfDoses(parseInt(option.text));
    }

    async function _addVaccinationData(){
        const items = await sp.web.lists.getByTitle("Employee").items.select("Author/Title").expand("Author").get();
        const filterByName = items.filter(item => item.Author.Title === loggedInUser);

        if (filterByName.length > 0) {
            alert("You can only add your vaccination details once! Please update your details if you want to make changes!");
        }
        else{
            const iar: IItemAddResult =  await sp.web.lists.getByTitle("employee").items.add({
                Vaccinated: isVaccinated ? "Yes" : "No",
                Number_Of_Doses: isVaccinated ? amountOfDoses.toString() : "N/A"
            });
        }
    }
    
    return(
        <div>
            <h2>Hello {loggedInUser}! Please fill out your vaccination data!</h2>
            <Toggle label="Are you vaccinated against COVID19?" onText="Yes" offText="No" onChange={() => setIsVaccinated(!isVaccinated)} />
            <ChoiceGroup disabled={!isVaccinated ? true : false} label='How many doses have you received?' defaultSelectedKey="1" options={amountOfDosesChoice} onChange={_setAmountOfDoses} />
            <PrimaryButton text="Submit Your Vaccination Data" onClick={_addVaccinationData} />
        </div>
    );
}