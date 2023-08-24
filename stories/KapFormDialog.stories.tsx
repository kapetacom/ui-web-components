import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Button, CircularProgress } from '@mui/material';
import { KapFormDialog } from '../src/dialogs/KapFormDialog';
import { FormField, FormFieldType } from '../src';

const meta: Meta = {
    title: 'Dialogs/KapFormDialog',
    component: KapFormDialog,
};

export default meta;

type Story = StoryObj<typeof KapFormDialog>;

export const Basic: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(true);
        const [isSaving, setIsSaving] = useState(false);
        const openDialog = () => setIsOpen(true);
        const closeDialog = () => setIsOpen(false);
        const onSubmitData = async (data: any) => {
            console.log('onSubmitData', data);
            setIsSaving(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setIsSaving(false);
            closeDialog();
        };
        return (
            <>
                <Button onClick={openDialog}>Open Dialog</Button>
                <KapFormDialog
                    open={isOpen}
                    onClose={closeDialog}
                    title="Dialog Title"
                    content={
                        <>
                            <FormField name={'name'} label={'Full name'} />
                            <FormField name={'age'} label={'Age'} type={FormFieldType.NUMBER} />
                        </>
                    }
                    actions={
                        <Button
                            type="submit"
                            variant="contained"
                            endIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
                            disabled={isSaving}
                        >
                            Save
                        </Button>
                    }
                    onSubmitData={(data) => {
                        onSubmitData(data).catch(() => undefined);
                    }}
                />
            </>
        );
    },
};
