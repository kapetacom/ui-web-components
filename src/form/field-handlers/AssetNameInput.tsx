import React, { useCallback, useEffect, useState } from "react";
import { FormSelect } from "../inputs/FormSelect";
import { FormInput, Type } from "../inputs/FormInput";

interface SharedProps {
  name?: string;
  label?: string;
  help?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

interface Props extends SharedProps {
  value: string;
  onChange: (name: string, value: string) => void;
  namespaces: string[];
}

export const AssetNameInput = (props: Props) => {
  const [namespace, setNamespace] = useState("");
  const [assetName, setAssetName] = useState("");

  // Reset state when value changes:
  useEffect(() => {
    const [newNamespace, newBlockName] = props.value?.split("/") || [];
    const defaultNamespace = props.namespaces?.[0] || '';
    setNamespace(newNamespace || defaultNamespace);
    setAssetName(newBlockName || '');
  }, [props.value, props.namespaces]);

  const callback = useCallback(
    (namespace: string, assetName: string) => {
      const value =
        namespace || assetName
          ? [
              // TODO: can we assume namespaces are already sanitized?
              namespace.toLowerCase(),
              assetName
                .toLowerCase()
                .replace(/[^a-z0-9_-]/g, "-")
                .replace(/^[^a-z]/, ""),
            ].join("/")
          : "";

      props.onChange(
        props.name,
        // Ensure value is empty if neither part is filled out
        value
      );
    },
    [props.name, props.onChange]
  );

  // Add a fake option for unknown namespaces (e.g. loading an asset that you can no longer access)

    const canAccessNamespace = (...args) => {
        if (!(props.namespaces ||[]).includes(namespace)) {
            throw new Error('Namespace not available');
        }
    }

    let namespaces = [...props.namespaces || []];
    if (!namespaces.includes(namespace)) {
        namespaces.push(namespace);
    }

  return (
    <div
      style={{ display: "flex", alignItems: "flex-start" }}
      className="asset-name-input"
    >
      <FormSelect
        label="Namespace"
        name="asset-namespace"
        value={namespace}
        readOnly={props.readOnly}
        onChange={(_name, value) => callback(value, assetName)}
        disabled={props.namespaces?.length < 2}
        validation={[canAccessNamespace]}
        options={namespaces}
        noTransform
      />
      <span style={{ flexGrow: 0, margin: "15px 10px", lineHeight: "30px" }}>
        /
      </span>
      <FormInput
        onChange={(_name, value) => {
          callback(namespace, value);
        }}
        label={props.label}
        name="asset-name"
        value={assetName}
        validation={["required"]}
        type={Type.TEXT}
        readOnly={props.readOnly}
        help={props.help}
      />
    </div>
  );
};
