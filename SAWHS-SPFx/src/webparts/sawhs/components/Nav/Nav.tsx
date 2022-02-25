import * as React from 'react';
import { Stack, IStackTokens } from '@fluentui/react';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';

export const Nav = (props) => {
    const stackTokens : IStackTokens = { childrenGap: 50 };
    return(
        <Stack horizontal horizontalAlign='center' tokens={stackTokens}>
            <DefaultButton text="Vaccination Declaration" onClick={props.declareVaccinationData}  />
            <PrimaryButton text="Daily Health Declaration" onClick={props.declareHealthDeclaration} />
        </Stack>
    );
};