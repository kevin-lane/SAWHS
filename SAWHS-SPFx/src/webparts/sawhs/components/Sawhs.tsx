import * as React from 'react';
import styles from './Sawhs.module.scss';
import { ISawhsProps } from './ISawhsProps';
import VaccinatedEmployee from './Forms/VaccinatedEmployee';
import { Nav } from './Nav/Nav';
import DailyHealthDeclaration from './Forms/DailyHealthDeclaration';
import { graph } from '@pnp/graph';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IsawhsState } from './ISawhsState';

export default class Sawhs extends React.Component<ISawhsProps, IsawhsState> {
  constructor(props: ISawhsProps) {
    super(props);
    this.state = {
      vaccinationDeclared: false
    };
  }

  public render(): React.ReactElement<ISawhsProps> {
    return (
      <div className={ styles.sawhs }>
        <Nav declareVaccinationData={() => this.setState({ vaccinationDeclared: false })} declareHealthDeclaration={() => this.setState({ vaccinationDeclared: true })} />
        {this.state.vaccinationDeclared ? <DailyHealthDeclaration /> : <VaccinatedEmployee />}
      </div>
    );
  }
}

async function declareVaccination(){
  var user = await graph.me();
  var name = user.displayName;
  const items = await sp.web.lists.getByTitle("Employee").items.select("Author/Title").expand("Author").get();
  console.log(items.length);
  
  const filterByName = items.filter(item => item.Author.Title === name );
  console.log(filterByName.length);
  if (filterByName.length === 0) {
    return <VaccinatedEmployee />;
  }
  else{
    return <DailyHealthDeclaration />;
  }
}
