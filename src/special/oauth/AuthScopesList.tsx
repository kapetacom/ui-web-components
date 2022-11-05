import React from "react";

import './AuthScopesList.less';
import {toClass} from "@blockware/ui-web-utils";
import {AuthScope} from "./scopes";


interface Props {
    scopes: AuthScope[]
    editable?:boolean
    onChange?:(scopes:AuthScope[]) => void
}

export const AuthScopesList = (props:Props) => {

    const editable = !!props.editable;
    const containerClass = toClass({
        'auth-scopes-list':true,
        'editable': editable
    });

    const enabledScopes = props.scopes.filter(s => s.enabled).map(s => s.id);

    /**
     * Determines if a scope is enabled as a consequence of other enabled scopes
     * E.g. that ends in *
     * @param scope
     */
    function isScopeEnabled(scope:string) {
        if (scope === '*') {
            return false;
        }

        if (enabledScopes.indexOf('*') > -1) {
            return true;
        }

        return enabledScopes.some(enabledScope => {
            if (enabledScope !== scope &&
                enabledScope.endsWith('*')) {
                return scope.startsWith(enabledScope.substring(0, enabledScope.length - 1));
            }
            return false;
        });
    }

    return (
        <ul className={containerClass}>

            {
                props.scopes.map((scope,ix) => {

                    const scopeEnabled = isScopeEnabled(scope.id);
                    const enabled = scope.enabled || scopeEnabled;
                    const elementClass = toClass({
                        'enabled': enabled,
                        'enabled-by-scope': scopeEnabled
                    });

                    const iconClass = toClass({
                        'fa icon': true,
                        'fa-check-circle': enabled,
                        'fa-times-circle': !enabled
                    })

                    return (
                        <li key={`scope_${ix}`}
                            className={elementClass}
                            onClick={() => {
                            if (!editable ||
                                !props.onChange) {
                                return;
                            }

                            scope.enabled = !enabled;
                            props.onChange([...props.scopes]);
                        }}>
                            <i className={iconClass} />
                            <div className={'text'}>
                                <span className={'name'}>{scope.name}</span>
                                <span className={'id'}>{scope.id}</span>
                            </div>
                        </li>
                    );
                })
            }
        </ul>
    )
}