// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { useState, Fragment } from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import formatMessage from 'format-message';

import { publishDialogText } from './styles';

export const PublishDialog = (props) => {
  const [comment, setComment] = useState('');
  const publishDialogProps = {
    title: 'Publish',
    type: DialogType.normal,
    subText: 'You are about to publish your bot to the profile below. Do you want to proceed?',
  };
  const submit = async () => {
    props.onDismiss();
    await props.onSubmit(comment);
  };
  return props.target ? (
    <Dialog
      dialogContentProps={publishDialogProps}
      hidden={false}
      modalProps={{ isBlocking: true }}
      onDismiss={props.onDismiss}
    >
      <Fragment>
        <div css={publishDialogText}>{props.target.name}</div>
        <form onSubmit={submit}>
          <TextField
            label={formatMessage('Comment')}
            multiline
            // styles={styles.textarea}
            onChange={(e, newvalue) => setComment(newvalue || '')}
            placeholder="Provide a brief description of this publish. It will appear on the publish history list"
          />
        </form>
        <DialogFooter>
          <DefaultButton onClick={props.onDismiss} text={formatMessage('Cancel')} />
          <PrimaryButton onClick={submit} text={formatMessage('Okay')} />
        </DialogFooter>
      </Fragment>
    </Dialog>
  ) : null;
};
