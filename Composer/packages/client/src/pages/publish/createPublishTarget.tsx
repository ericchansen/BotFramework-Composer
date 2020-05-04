// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/** @jsx jsx */
import { jsx } from '@emotion/core';
import formatMessage from 'format-message';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { Fragment, useState, useMemo } from 'react';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { JsonEditor } from '@bfc/code-editor';

import { PublishTarget, PublishType } from '../../store/types';

import { label } from './styles';

interface CreatePublishTargetProps {
  closeDialog: () => void;
  current: PublishTarget | null;
  targets: PublishTarget[];
  types: PublishType[];
  updateSettings: (name: string, type: string, configuration: string) => Promise<void>;
}

const CreatePublishTarget: React.FC<CreatePublishTargetProps> = (props) => {
  const [targetType, setTargetType] = useState<string | undefined>(props.current?.type);
  const [name, setName] = useState(props.current ? props.current.name : '');
  const [config, setConfig] = useState(props.current ? JSON.parse(props.current.configuration) : undefined);
  const [errorMessage, setErrorMsg] = useState('');

  const targetTypes = useMemo(() => {
    return props.types.map((t) => ({ key: t.name, text: t.name }));
  }, [props.targets]);

  const updateType = (_e, option?: IDropdownOption) => {
    const type = props.types.find((t) => t.name === option?.key);

    if (type) {
      setTargetType(type.name);
    }
  };

  const updateConfig = (newConfig) => {
    setConfig(newConfig);
  };

  const isNameValid = (newName) => {
    if (!newName || newName.trim() === '') {
      setErrorMsg(formatMessage('Must have a name'));
    } else {
      const exists = !!props.targets?.find((t) => t.name.toLowerCase() === newName?.toLowerCase);

      if (exists) {
        setErrorMsg(formatMessage('A profile with that name already exists.'));
      }
    }
  };

  const schema = useMemo(() => {
    return targetType ? props.types.find((t) => t.name === targetType)?.schema : undefined;
  }, [props.targets, targetType]);

  const updateName = (e, newName) => {
    setErrorMsg('');
    setName(newName);
    isNameValid(newName);
  };

  const isDisable = () => {
    if (!targetType || !name || errorMessage) {
      return true;
    } else {
      return false;
    }
  };

  const submit = async () => {
    if (targetType) {
      await props.updateSettings(name, targetType, JSON.stringify(config) || '{}');
      props.closeDialog();
    }
  };

  return (
    <Fragment>
      <form onSubmit={submit}>
        <TextField
          defaultValue={props.current ? props.current.name : ''}
          errorMessage={errorMessage}
          label={formatMessage('Name')}
          onChange={updateName}
          placeholder={formatMessage('My Publish Profile')}
        />
        <Dropdown
          defaultSelectedKey={props.current ? props.current.type : null}
          label={formatMessage('Publish Destination Type')}
          onChange={updateType}
          options={targetTypes}
          placeholder={formatMessage('Choose One')}
        />
        <div css={label}>{formatMessage('Publish Configuration')}</div>
        <JsonEditor height={200} key={targetType} onChange={updateConfig} schema={schema} value={config} />
        <button disabled={isDisable()} hidden type="submit" />
      </form>
      <DialogFooter>
        <DefaultButton onClick={props.closeDialog} text={formatMessage('Cancel')} />
        <PrimaryButton disabled={isDisable()} onClick={submit} text={formatMessage('Save')} />
      </DialogFooter>
    </Fragment>
  );
};

export { CreatePublishTarget };
