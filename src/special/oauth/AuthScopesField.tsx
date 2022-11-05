import {AuthScopesList} from "./AuthScopesList";

import React from "react";

import './AuthScopesField.less';
import {FormElementContainer} from "../../form/inputs/FormElementContainer";
import {FormFieldHandler} from "../../form/inputs/FormFieldHandler";
import {AuthScope} from "./scopes";


interface Props {
    name: string
    scopes: AuthScope[]
    label?: string
}

export const AuthScopesField = (props: Props) => {

    return (

        <FormElementContainer
            label={props.label}
            focused={false}
            hasValue={true}
            touched={false}
            errorMessage={''}>
            <div className={'auth-scopes-field'}>
                <FormFieldHandler name={props.name}
                                  component={(fieldProps) => {

                                      return (
                                          <AuthScopesList
                                              editable={true}
                                              scopes={props.scopes.map(scope => {
                                                  return {
                                                      enabled: fieldProps.value?.indexOf(scope.id) > -1,
                                                      ...scope
                                                  }
                                              })}
                                              onChange={(scopes) => {
                                                  fieldProps.onChange(fieldProps.name, scopes.filter(scope => scope.enabled).map(scope => scope.id));
                                              }}
                                          />
                                      )
                                  }}/>
            </div>
        </FormElementContainer>

    )
}