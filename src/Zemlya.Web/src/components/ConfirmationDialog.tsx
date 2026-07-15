import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"

export const ConfirmationDialog = (props:{
    dialogTitle : string,
    dialogContent : string,
    isOpen : boolean,
    handleClose : () => void,
    handleAgree : () => void
}) => {

    return <Dialog 
    open={props.isOpen}
    keepMounted
    onClose={props.handleClose}
    >
        <DialogTitle>{props.dialogTitle}</DialogTitle>
        <DialogContent>{props.dialogContent}</DialogContent>
        <DialogActions>
            <Button onClick={props.handleAgree}>Так</Button>
            <Button onClick={props.handleClose}>Ні</Button>
        </DialogActions>
    </Dialog>
}