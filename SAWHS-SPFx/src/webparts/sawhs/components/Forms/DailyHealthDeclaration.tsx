import * as React from 'react';
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react/lib/ChoiceGroup';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { useState } from 'react';
import { graph } from '@pnp/graph';
import "@pnp/graph/users";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IItemAddResult } from "@pnp/sp/items";

const symptomsOptions: IChoiceGroupOption[] = [
    { key: 'Y', text: 'YES' },
    { key: 'N', text: 'NO' }
  ];

  const travelOptions: IChoiceGroupOption[] = [
    { key: 'Y', text: 'YES' },
    { key: 'N', text: 'NO' }
  ];

  const officePresenceOptions: IChoiceGroupOption[] = [
    { key: 'Y', text: 'YES' },
    { key: 'N', text: 'NO' }
  ];

  const officePresenceReasonOptions: IChoiceGroupOption[] = [
    { key: 'ANV', text: 'ACTIVITY THAT CAN NOT BE DONE VIRTUALLY, LIKE SIGNING DOCUMENTS' },
    { key: 'PAH', text: 'PROBLEMS AT HOME, LIKE CLOSURE OF INTERNET CONNECTIVITY OR POWER CUT' },
    { key: 'N', text: 'NO' }
  ];

export default function DailyHealthDeclaration(){
  const [loggedInUser, setLoggedInUser] = useState("");
  const [vaccinationDeclaredUser, setVaccinationDeclaredUser] = useState(0);
  const [symptoms, setSymptoms] = useState('NO');
  const [travel, setTravel] = useState('NO');
  const [presenceAtOffice, setPresenceAtOffice] = useState('NO');
  const [reasonToBeAtOffice, setReasonToBeAtOffice] = useState('NO');

  async function _getUserInfo() {
    var user = await graph.me();
    setLoggedInUser(user.displayName);

    const employees = await sp.web.lists.getByTitle("Employee").items.select("Author/Title").expand("Author").get();
    const declarations = await sp.web.lists.getByTitle("Health Declarations").items.select("Author/Title").expand("Author").get();
    
    const filterByName = employees.filter(item => item.Author.Title === loggedInUser );
    setVaccinationDeclaredUser(filterByName.length);
  }
  _getUserInfo();

  function _setSymptoms(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption){
    setSymptoms(option.text);
  }

  function _setTravel(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption){
    setTravel(option.text);
  }

  function _setPresence(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption){
    setPresenceAtOffice(option.text);
  }

  function _setReason(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption){
    setReasonToBeAtOffice(option.text);
  }

  async function _addEmployeeDeclaration(){
    const items = await sp.web.lists.getByTitle("Health Declarations").items.select("Author/Title").expand("Author").get();
    const filterByName = items.filter(item => item.Author.Title === loggedInUser );

    if (filterByName.length > 0) {
      alert("You have already filled out your health declaration. Please wait until 2 days has gone!");
    }
    else{
      const iar: IItemAddResult =  await sp.web.lists.getByTitle("Health Declarations").items.add({
          Symptoms: symptoms,
          Travel: travel,
          Presence: presenceAtOffice,
          Reason: reasonToBeAtOffice
      });
    }
  }
    return(
        <div>
        {
            vaccinationDeclaredUser === 0 ? 
            <h3>{loggedInUser}, please declare you vaccination data before you declare your health declaration form!</h3>
            :
            <div>
              <ChoiceGroup defaultSelectedKey='N' options={symptomsOptions} onChange={_setSymptoms} label='Do you have any symptoms of COVID19(e.g. Fever, cough, Nausea etc.) today?'/>
              <ChoiceGroup defaultSelectedKey='N' options={travelOptions} onChange={_setTravel} label='Have you been abroad within the last 48 hours?'/>
              <ChoiceGroup defaultSelectedKey='N' options={officePresenceOptions} onChange={_setPresence} label='Are you currently at the office?'/>
              <ChoiceGroup defaultSelectedKey='N' options={officePresenceReasonOptions} onChange={_setReason} label='Do you have any important reason to be at the office today?'/>
              <PrimaryButton text="Submit" onClick={_addEmployeeDeclaration} />
            </div>
        }
        </div>
    );
}